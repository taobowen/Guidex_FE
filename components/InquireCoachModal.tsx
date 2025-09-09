import React, { useMemo } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Modal, Portal, Text, Button, Surface, Divider, TextInput } from 'react-native-paper';

const InquireCoachModal = ({
  visible,
  onDismiss,
  submitCoachInquiry,
}: {
  visible: boolean;
  onDismiss: () => void;
  submitCoachInquiry: () => void;
}) => {

  const [coachMessage, setCoachMessage] = React.useState('');

  const CHAR_LIMIT = 1000;

  const remaining = useMemo(() => Math.max(0, CHAR_LIMIT - (coachMessage?.length || 0)), [coachMessage]);
  const canSubmit = useMemo(() => coachMessage.trim().length > 0 && remaining >= 0, [coachMessage, remaining]);

  return (
      <Portal>
        <Modal
          visible={visible}
          onDismiss={onDismiss}
          contentContainerStyle={styles.modalContainer}
        >
          <Surface style={styles.modalSurface} elevation={2}>
            <Text style={styles.modalTitle}>Write down something to your coach about this inquiry...</Text>

            <Divider />

            {/* Editor */}
            <View style={styles.editorWrap}>
              <TextInput
                mode="outlined"
                multiline
                value={coachMessage}
                onChangeText={(t) => t.length <= CHAR_LIMIT && setCoachMessage(t)}
                placeholder={
                  '• Be specific about what you observed\n' +
                  '• Highlight both strengths and areas for improvement\n' +
                  '• Provide actionable suggestions\n' +
                  '• Reference specific moments in the video\n' +
                  '• Encourage continued practice'
                }
                style={styles.editorInput}
              />
              <Text style={styles.counter}>{`${coachMessage.length} / ${CHAR_LIMIT}`}</Text>
            </View>

            <Button
              mode="contained"
              onPress={submitCoachInquiry}
              disabled={!canSubmit}
              style={styles.submitBtn}
              contentStyle={{ height: 48 }}
            >
              Submit
            </Button>
          </Surface>
        </Modal>
      </Portal>
  );
}

const styles = StyleSheet.create({
      modalSurface: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
  },
  modalTitle: {
    fontWeight: '800',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    color: '#111827',
  },
  editorWrap: {
    marginTop: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  editorInput: {
    minHeight: 180,
    backgroundColor: '#fff',
  },
  counter: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    fontSize: 12,
    color: '#6b7280',
  },
  submitBtn: {
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: '#4b5563', // soft gray like the mock "Submit" bar
  },
  modalContainer: {
    margin: 20,
  },
});

export default InquireCoachModal;