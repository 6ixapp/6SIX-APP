import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const demoDetails = [
  `NYU'26`,
  'Econ (but kinda hate it)',
  'Love chess and hiking'
]

const networkDetails = [
  "You're 2° from 6 founders in NYC",
  "You're 3° from someone who graduated from Columbia",
  "You're 2° from 3 people who've lived in London",
  "Your contacts span 12 different time zones",
  "Your strongest 1° cluster is in Berlin",
  "You're 2° from someone who's published a book",
  "Your network's top industry is finance (42% of contacts)"
];


const ProfileDetails = () => {
  return (
    <View>
      <View style={styles.detailsContainer}>
        <View style={styles.col}>
          {demoDetails.map((detail, i) =>
            <View key={i} style={styles.row}>
              <View style={styles.blueBall} />
              <Text style={styles.detailsText}>{detail}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.networkTitle}>
        <Text style={styles.networkTitleText}>Your Networks</Text>
      </View>


      <View style={styles.networkConatiner}>
        <View style={styles.networkcol}>
          {networkDetails.map((network, i) =>
            <View key={i} style={styles.networkTextContainer}>
              <Text style={styles.networkText}>{network}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  detailsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 40,
    marginHorizontal: 20,
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  col: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blueBall: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#35c3f0',
    marginRight: 10,
  },
  detailsText: {
    fontSize: 20,
  },
  networkTitle: {
    marginTop: 20,
    marginHorizontal: 20,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 6,
    borderRadius: 12,
  },
  networkTitleText: {
    textAlign: 'left',
    fontSize: 20,
    fontFamily: 'TimesNewRomanRegular'
  },
  networkConatiner: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 24,
    marginTop: 24,
    borderRadius: 12,
  },
  networkcol: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
    width: '100%'
  },
  networkTextContainer: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    width: '100%',
  },
  networkText: {
    fontSize: 16,
    color: '#000', // nice dark text
    flexWrap: 'wrap',
  }

})

export default ProfileDetails
