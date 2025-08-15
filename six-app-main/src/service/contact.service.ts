import { supabase } from "../db/supabase";
import { logger } from "./logger.service";
import { addConnection } from "./neo4j.service";

export const syncContactsWithSupabase = async (phoneNumbers: string[]) => {
    try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !sessionData?.session?.user?.id) {
      const error = new Error('User session error or no user signed in');
      logger.error('syncContactsWithSupabase', error.message);
      throw error;
    }

    const currentUserId = sessionData.session.user.id;

    // Call RPC to match contacts
    const { data: matchedUsers, error } = await supabase.rpc('match_contacts_by_last10', {
      contact_last10s: phoneNumbers,
      requesting_user: currentUserId,
    });

    if (error) {
      logger.error('syncContactsWithSupabase', 'Error matching contacts via RPC:', error.message);
      throw error;
    }

    if (!matchedUsers || matchedUsers.length === 0) {
      const error = new Error('No matching users found');
      logger.error('syncContactsWithSupabase', error.message);
      throw error;
    }

    let successCount = 0;
    for (const user of matchedUsers) {
      const { contact_user_id, name, phone } = user;

      if (contact_user_id && contact_user_id !== currentUserId) {
        try {
          await addConnection(currentUserId, contact_user_id);
          successCount++;
        } catch (neoError) {
          logger.error('syncContactsWithSupabase', `Failed to add Neo4j connection for ${currentUserId} -> ${contact_user_id}`);
        }
      }
    }

    if (successCount === 0) {
      throw new Error('No connections were created successfully');
    }

    return successCount;
  } catch (error) {
    logger.error('syncContactsWithSupabase', 'Unexpected error syncing contacts:', error as string);
    throw error; // Re-throw the error to be handled by the caller
  }
};