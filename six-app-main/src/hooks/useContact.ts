import { logger } from '@/src/service/logger.service';
import * as Contacts from 'expo-contacts';
import { useCallback, useRef, useState } from 'react';

export interface UseContactsReturn {
  contacts: Contacts.Contact[];
  permissionStatus: string;
  isLoading: boolean;
  isSyncing: boolean;
  checkAndLoadContacts: (shouldAutoSync?: boolean) => Promise<void>;
  syncContacts: () => Promise<void>;
  handleReload: () => Promise<void>;
}

export const useContacts = (): UseContactsReturn => {
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<string>('checking');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  
  // Add refs to prevent redundant operations
  const lastLoadTime = useRef<number>(0);
  const loadingPromise = useRef<Promise<Contacts.Contact[]> | null>(null);
  const checkingPromise = useRef<Promise<void> | null>(null);

  // Extract unique last 10 digits of phone numbers from contact data
  const extractUniqueLast10Digits = useCallback((contacts: Contacts.Contact[]): string[] => {
    const seen = new Set<string>();
    const numbers: string[] = [];

    for (const contact of contacts) {
      if (contact.phoneNumbers) {
        for (const phone of contact.phoneNumbers) {
          if (!phone.number) continue;

          const digitsOnly = phone.number.replace(/\D/g, '');
          const last10 = digitsOnly.length >= 10 ? digitsOnly.slice(-10) : null;

          if (last10 && !seen.has(last10)) {
            seen.add(last10);
            numbers.push(last10);
          }
        }
      }
    }

    return numbers;
  }, []);

  // Load contacts from device with caching
  const loadContacts = useCallback(async (): Promise<Contacts.Contact[]> => {
    
    // If we're already loading, return the existing promise
    if (loadingPromise.current) {
      return await loadingPromise.current;
    }

    // Check if we loaded recently (within 30 seconds) and have contacts
    const now = Date.now();
    if (contacts.length > 0 && (now - lastLoadTime.current) < 30000) {
      return contacts;
    }

    // Create the loading promise
    loadingPromise.current = (async (): Promise<Contacts.Contact[]> => {
      setIsLoading(true);
      
      try {
        const { status } = await Contacts.getPermissionsAsync();
        setPermissionStatus(status);

        if (status !== 'granted') {
          return [];
        }

        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
        });


        if (!data || data.length === 0) {
          return [];
        }

        setContacts(data);
        lastLoadTime.current = now;
        return data;
      } catch (error) {
        logger.error('loadContacts', 'Error loading contacts:', error as string);
        return [];
      } finally {
        setIsLoading(false);
        loadingPromise.current = null;
      }
    })();

    return await loadingPromise.current;
  }, [contacts]);

  // Sync contacts with Supabase
  const syncContacts = useCallback(async (contactsData?: Contacts.Contact[]): Promise<void> => {
    
    // Prevent multiple simultaneous syncs
    if (isSyncing) {
      return;
    }
    
    setIsSyncing(true);
    
    try {
      const contactsToSync = contactsData || contacts;
      
      if (contactsToSync.length === 0) {
        throw new Error('No contacts available to sync');
      }

      const phoneNumbers = extractUniqueLast10Digits(contactsToSync);
    } catch (error) {
      logger.error('syncContacts', 'Error syncing contacts:', error as string);
      throw error;
    } finally { 
      setIsSyncing(false);
    }
  }, [contacts, extractUniqueLast10Digits, isSyncing]);

  // Check permissions and load contacts (with optional auto-sync) 
  const checkAndLoadContacts = useCallback(async (shouldAutoSync: boolean = false): Promise<void> => {
    
    // If we're already checking, return the existing promise
    if (checkingPromise.current) {
      return await checkingPromise.current;
    }

    // Create the checking promise
    checkingPromise.current = (async (): Promise<void> => {
      try {
        let { status } = await Contacts.getPermissionsAsync();

        // Always request permission if not granted
        if (status !== 'granted') {
          const { status: newStatus } = await Contacts.requestPermissionsAsync();
          status = newStatus;
        }

        setPermissionStatus(status);

        if (status === 'granted') {
          const loadedContacts = await loadContacts();
          
          // Only auto-sync if explicitly requested and we have contacts
          if (shouldAutoSync && loadedContacts.length > 0) {
            await syncContacts(loadedContacts);
          }
        } else {
          throw new Error(`Permission not granted: ${status}`);
        }
      } catch (error) {
        logger.error('checkAndLoadContacts', 'Error in checkAndLoadContacts:', error as string);
        setPermissionStatus('error');
        throw error; // Re-throw to be handled by the caller
      } finally {
        checkingPromise.current = null;
      }
    })();

    return await checkingPromise.current;
  }, [loadContacts, syncContacts]);

  // Handle reload after permission changes
  const handleReload = useCallback(async (): Promise<void> => {
    // Clear cache to force fresh load
    lastLoadTime.current = 0;
    
    const { status } = await Contacts.getPermissionsAsync();
    setPermissionStatus(status);

    if (status === 'granted') {
      const loadedContacts = await loadContacts();
      if (loadedContacts.length > 0) {
        await syncContacts(loadedContacts);
      }
    }
  }, [loadContacts, syncContacts]);

  return {
    contacts,
    permissionStatus,
    isLoading,
    isSyncing,
    checkAndLoadContacts,
    syncContacts,
    handleReload,
  };
};