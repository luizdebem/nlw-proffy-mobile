import React, { useState, useEffect } from 'react'
import { View, ScrollView, Text, TextInput } from 'react-native';
import styles from './styles';
import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import api from '../../services/api';
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function TeacherList() {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const [teachers, setTeachers] = useState([]);

  const [subject, setSubject] = useState('');
  const [week_day, setWeekDay] = useState('');
  const [time, setTime] = useState('');

  const [favorites, setFavorites] = useState<number[]>([]);

  function loadFavorites() {
    AsyncStorage.getItem('favorites').then(res => {
      if (res) {
        const favoritedTeachers = JSON.parse(res);
        const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => {
          return teacher.id;
        });
        setFavorites(favoritedTeachersIds);
      }
    });
  }

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  )

  function toggleFiltersVisible() {
    setIsFiltersVisible(!isFiltersVisible);
  }

  async function submitFilters() {
    loadFavorites();

    const res = await api.get('classes', {
      params: {
        subject,
        week_day,
        time
      }
    });
    setIsFiltersVisible(false);
    setTeachers(res.data);
  }

  return (
    <View style={styles.container}>
      <PageHeader title="Proffys disponíveis" headerRight={(
        <BorderlessButton onPress={toggleFiltersVisible}>
          <Feather name="filter" size={20} color="#FFF" />
        </BorderlessButton>
      )}>
        {isFiltersVisible && (
          <View style={styles.searchForm}>
            <Text style={styles.label}>Matéria</Text>
            <TextInput style={styles.input} value={subject} onChangeText={text => setSubject(text)} placeholder="Qual a matéria?" placeholderTextColor="#C1BCCC" />

            <View style={styles.inputGroup}>
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Dia da semana</Text>
                <TextInput style={styles.input} value={week_day} onChangeText={text => setWeekDay(text)} placeholder="Qual o dia?" placeholderTextColor="#C1BCCC" />
              </View>

              <View style={styles.inputBlock}>
                <Text style={styles.label}>Horário</Text>
                <TextInput style={styles.input} value={time} onChangeText={text => setTime(text)} placeholder="Qual horário?" placeholderTextColor="#C1BCCC" />
              </View>
            </View>

            <RectButton onPress={submitFilters} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Filtrar</Text>
            </RectButton>
          </View>
        )}
      </PageHeader>

      <ScrollView
        style={styles.teacherList}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16
        }}
      >
        {teachers.map((teacher: Teacher) => {
          return <TeacherItem key={teacher.id} teacher={teacher} favorited={favorites.includes(teacher.id)} />
        })}
      </ScrollView>
    </View>
  )
}
