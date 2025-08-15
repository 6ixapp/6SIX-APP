import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ProfileInfoProps {
  name?: string;
  traits?: string[];
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ name, traits = [] }) => {
  return (
    <>
      <View style={styles.nameContainer}>
        <Text style={styles.nameText}>{name}</Text>
      </View>

      <View style={styles.infoContainer}>
        {traits.map((keyword, i, arr) => (
          <React.Fragment key={i}>
            <Text style={styles.infoText}>{keyword}</Text>
            {i !== arr.length - 1 && (
              <Text style={styles.infoText}> | </Text>
            )}
          </React.Fragment>
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  nameContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  nameText: {
    fontSize: 28,
    fontFamily: 'TimesNewRomanBoldItalic',
  },
  infoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  infoText: {
    fontSize: 20,
    fontWeight: '400',
    textAlign: 'center',
    marginHorizontal: 2,
  },
});

export default ProfileInfo; 