import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no' | null>(null);
  const [formData, setFormdata] = useState(
    {
    }
  )
  const [questions, setQuestions] = useState([]);
  const [shouldFetchNext, setShouldFetchNext] = useState(false);

  const BASEURL = "http://0.0.0.0:8001/hip"

  const screeningInit = async () => {
    try {
      const response = await fetch(BASEURL + '/screening_info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch next question');
      }

      const res = await response.json();
      setQuestions([res?.question_meta]);
      setFormdata(prev => ({
        ...prev,
        question_id: res?.question_meta?.question_id,
        answer_id: res?.question_meta?.answer_id,
        question_count: res?.question_meta?.question_count,
      }))
      // setCurrentSectionId(res?.question_meta?.section_meta?.section_id);

    } catch (error) {
      console.error('Error fetching next question:', error);
    }
  }

  useEffect(() => {
    screeningInit()
  }, []);

  const handleNextQuestion = async () => {
    // setLoading(true)

    setTimeout(async () => {
      // if (!formData?.question_id || !formData?.answer_id) {
      //     console.error('Validation Error: question_id and answer_id are required.');
      //     // setLoading(false);
      //     return;
      // }
      formData.type = 'next_question';
      // formData.section_id = currentSectionId;
      formData.section_id = "SD";

      // console.log(formData)
      try {
        const response = await fetch(BASEURL + '/screening_player', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          throw new Error('Failed to fetch next question');
        }

        const res = await response.json();
        setQuestions([res.next_question]);
        // setCurrentQuestionIndex(prev => prev + 1);

        setFormdata(prev => ({
          ...prev,
          question_id: res?.next_question?.question_id,
          answer_id: res?.next_question?.answer_id,
          question_count: res?.next_question?.question_count,
          ui_type: res?.next_question?.ui_type,
        }))
        // setCurrentSectionId(res?.next_question?.section_meta?.section_id);
        // setIsSectionHeader(res?.next_question?.ui_type === 'section_header' ? true : false)
      } catch (error) {
        console.error('Error fetching next question:', error);
      }
    }, 100);
  };

  useEffect(() => {
    if (shouldFetchNext) {
        handleNextQuestion();
        setShouldFetchNext(false);
    }
}, [formData]);

  return (
    <ThemedView style={styles.questionContainer}>
      {questions[0] && (
        <>
          <ThemedText style={styles.questionText}>
            {questions[0].ui_label}
          </ThemedText>

          <ThemedView style={styles.radioGroup}>
            {questions[0].ui_options.map((option) => (
              <Pressable
                key={option.answer_id}
                style={styles.radioButton}
                onPress={() => {
                  setSelectedOption(option.answer_id);
                  setFormdata(prev => ({
                    ...prev,
                    answer_id: option.answer_id
                  }));
                  setShouldFetchNext(true);

                }}
              >
                <ThemedView style={styles.circle}>
                  {selectedOption === option.answer_id && (
                    <ThemedView style={styles.innerCircle} />
                  )}
                </ThemedView>
                <ThemedText style={styles.label}>{option.label}</ThemedText>
              </Pressable>
            ))}
          </ThemedView>
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  questionText: {
    fontSize: 18,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 40,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
  },
  innerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#444',
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
  },
});

function QuestionWithRadioButtons() {

}
