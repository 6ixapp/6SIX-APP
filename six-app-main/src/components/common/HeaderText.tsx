import React from 'react'
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native'

type HeaderTextProps = {
    title: string
    style?: StyleProp<TextStyle>
}

const HeaderText = ({title, style}: HeaderTextProps) => {
    return (
        <Text style={[styles.headerTitle, style]}>{title}</Text>
    )
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 42,
    fontFamily: 'TimesNewRomanBold',
  },
})

export default HeaderText