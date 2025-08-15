import { CategoryTabs } from '@/src/constants/types/categoryTabs';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    tabs: CategoryTabs[];
    selectedTabs: CategoryTabs[];
    onToggle: (tab: CategoryTabs) => void;
};

const CategoryTabSelector = ({ tabs, selectedTabs, onToggle }: Props) => {
    return (
        <View style={styles.categoryTabContainer}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 10 }}
            >
                {tabs.map((tab, index) => {
                    const isSelected = selectedTabs.includes(tab);

                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => onToggle(tab)}
                            style={[
                                styles.categoryTab,
                                {
                                    backgroundColor: isSelected ? '#9191ff' : '#fff',

                                },
                            ]}
                        >
                            <Text style={[styles.categoryTabText, {
                                color: isSelected ? '#fff' : '#000',
                            }]}>{tab}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({

    categoryTabContainer: {
        paddingVertical: 10
    },
    categoryTab: {
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderRadius: 20,
        margin: 4,
        borderColor: '#000',
        borderWidth: 1,
    },
    categoryTabSelected: {
        backgroundColor: '#5170ff',
    },
    categoryTabText: {
        color: '#333',
        fontWeight: '500'
    },
    categoryTabTextSelected: {
        fontWeight: 'bold',
    },
})

export default CategoryTabSelector