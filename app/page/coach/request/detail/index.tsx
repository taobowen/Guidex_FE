import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import {
  Text,
  Appbar,
  Surface,
  Button,
  IconButton,
  TextInput,
  Divider,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Video, ResizeMode } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import axiosInstance from "@/app/utils/axiosInstance";

const BLUE = "#257AFD";
const BG = "#f2f6fb";
const CHAR_LIMIT = 1000;

type Keyframe = {
  id: string;
  time: number; // seconds
  note: string;
  expanded: boolean;
};

export default function WriteFeedback() {
  const router = useRouter();
  const { recordId, videoUrl } = useLocalSearchParams<{
    recordId?: string;
    videoUrl?: string;
  }>();

  const videoRef = React.useRef<Video>(null);

  // video state
  const [duration, setDuration] = React.useState(0);
  const [position, setPosition] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);

  // keyframes
  const [keyframes, setKeyframes] = React.useState<Keyframe[]>([]);
  const [savingKF, setSavingKF] = React.useState(false);

  // general feedback
  const [generalNote, setGeneralNote] = React.useState("");
  const [sel, setSel] = React.useState<{ start: number; end: number }>({
    start: 0,
    end: 0,
  });

  React.useEffect(() => {
    const interval = setInterval(async () => {
      const st = await videoRef.current?.getStatusAsync();
      if (st && "positionMillis" in st) {
        setPosition(st.positionMillis / 1000);
        if (st.durationMillis) setDuration(st.durationMillis / 1000);
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s: number) => {
    const mm = Math.floor(s / 60);
    const ss = Math.floor(s % 60);
    return `${mm}:${`${ss}`.padStart(2, "0")}`;
  };

  // ---- Keyframe handlers ----
  const addAtCurrentTime = () => {
    const t = Math.max(0, Math.round(position));
    const id = `${t}-${Date.now()}`;
    setKeyframes((prev) => [
      ...prev,
      { id, time: t, note: "", expanded: true },
    ]);
  };

  const toggleExpand = (id: string) =>
    setKeyframes((prev) =>
      prev.map((k) => (k.id === id ? { ...k, expanded: !k.expanded } : k))
    );

  const updateKFNote = (id: string, note: string) =>
    setKeyframes((prev) => prev.map((k) => (k.id === id ? { ...k, note } : k)));

  const deleteKF = (id: string) =>
    setKeyframes((prev) => prev.filter((k) => k.id !== id));

  const saveCurrentExpandedKF = async () => {
    try {
      setSavingKF(true);
      // Find the first expanded as "current"
      const current = keyframes.find((k) => k.expanded);
      // TODO: Adjust to your API; sending one keyframe
      await axiosInstance.post(`/system/coach-feedback/${recordId}/keyframe`, {
        time: current?.time,
        note: current?.note,
        platform: Platform.OS,
      });
      // snack/toast UX could be added
    } catch (e) {
      console.warn("save keyframe error", e);
    } finally {
      setSavingKF(false);
    }
  };

  const submitAll = async () => {
    try {
      const payload = {
        recordId,
        generalNote,
        keyframes: keyframes.map((k) => ({ time: k.time, note: k.note })),
        platform: Platform.OS,
      };
      await axiosInstance.post(`/system/coach-feedback/${recordId}`, payload);
      alert("Feedback submitted!");
      router.back();
    } catch (e) {
      console.error(e);
      alert("Submit failed. Please try again.");
    }
  };

  return (
    <View style={styles.screen}>
      {/* Gradient header */}
      <LinearGradient
        colors={["#5f68ff", "#7b5bff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGrad}
      >
        <Appbar.Header
          statusBarHeight={0}
          style={[styles.appbar, { backgroundColor: "transparent" }]}
        >
          <Appbar.Action icon="arrow-left" color="#fff" onPress={() => router.back()} />
          <Appbar.Content title="Write Feedback" titleStyle={{ color: "#fff", fontWeight: "800" }} />
        </Appbar.Header>

        {/* Video */}
        <Surface style={styles.videoCard} elevation={0}>
          {videoUrl ? (
            <Video
              ref={videoRef}
              style={styles.video}
              source={{ uri: String(videoUrl) }}
              useNativeControls={false}
              resizeMode={ResizeMode.COVER}
              shouldPlay={false}
            />
          ) : (
            <LinearGradient
              colors={["#2b2f52", "#2c205c"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.video}
            />
          )}

          {/* Play/pause button */}
          <Pressable
            onPress={async () => {
              const st = await videoRef.current?.getStatusAsync();
              if (st && "isPlaying" in st && st.isPlaying) {
                await videoRef.current?.pauseAsync();
                setPlaying(false);
              } else {
                await videoRef.current?.playAsync();
                setPlaying(true);
              }
            }}
            style={styles.playOverlay}
          >
            <View style={styles.playCircle}>
              <Text style={{ color: "#fff", fontWeight: "800" }}>{playing ? "❚❚" : "▶"}</Text>
            </View>
          </Pressable>

          {/* Title + subtitle (static sample) */}
          <View style={styles.videoText}>
            <Text style={styles.videoTitle}>Skiing Analysis Video</Text>
            <Text style={styles.videoSub}>Parallel Turn Technique Session</Text>
          </View>

          {/* Progress */}
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: duration ? `${(position / duration) * 100}%` : "0%" },
              ]}
            />
          </View>
          <Text style={styles.timecode}>
            {formatTime(position)} / {formatTime(duration || 1)}
          </Text>
        </Surface>
      </LinearGradient>

      {/* Body */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Key Frame Feedback */}
        <Surface style={styles.kfCard} elevation={1}>
          <View style={styles.kfHeader}>
            <Text style={styles.kfTitle}>Key Frame Feedback</Text>
            <Button
              compact
              mode="contained"
              onPress={addAtCurrentTime}
              buttonColor="#5d8aff"
              textColor="#fff"
            >
              + Add at Current Time
            </Button>
          </View>

          <Surface style={styles.positionBox} elevation={0}>
            <Text style={styles.positionLabel}>CURRENT POSITION</Text>
            <Text style={styles.positionValue}>{formatTime(position)}</Text>
          </Surface>

          {/* Keyframe list */}
          <View style={{ gap: 10, marginTop: 10 }}>
            {keyframes.map((kf) => (
              <Surface key={kf.id} style={styles.kfRow} elevation={0}>
                <View style={styles.kfRowTop}>
                  <Text style={styles.kfTime}>{formatTime(kf.time)}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <IconButton
                      icon={kf.expanded ? "chevron-up" : "chevron-down"}
                      onPress={() => toggleExpand(kf.id)}
                    />
                    <IconButton icon="delete-outline" onPress={() => deleteKF(kf.id)} />
                  </View>
                </View>

                {kf.expanded && (
                  <TextInput
                    mode="outlined"
                    placeholder="Add specific feedback for this moment in the video..."
                    value={kf.note}
                    onChangeText={(t) => updateKFNote(kf.id, t)}
                    multiline
                    style={styles.kfInput}
                  />
                )}
              </Surface>
            ))}
          </View>

          <Button
            mode="contained-tonal"
            style={{ marginTop: 10 }}
            onPress={saveCurrentExpandedKF}
            loading={savingKF}
          >
            Save key frame feedback
          </Button>
        </Surface>

        {/* Rich note toolbar */}
        <Surface style={styles.editorCard} elevation={1}>

          <TextInput
            mode="outlined"
            multiline
            value={generalNote}
            onChangeText={(t) => t.length <= CHAR_LIMIT && setGeneralNote(t)}
            placeholder={
              "• Be specific about what you observed\n" +
              "• Highlight both strengths and areas for improvement\n" +
              "• Provide actionable suggestions\n" +
              "• Reference specific moments in the video\n" +
              "• Encourage continued practice"
            }
            style={styles.editorInput}
            onSelectionChange={(e) => setSel(e.nativeEvent.selection)}
          />
          <Text style={styles.counter}>{`${generalNote.length} / ${CHAR_LIMIT}`}</Text>
        </Surface>

        <Divider style={{ marginVertical: 6, opacity: 0 }} />

        {/* Submit */}
        <Button
          mode="contained"
          onPress={submitAll}
          style={styles.submitBtn}
          contentStyle={{ height: 48 }}
        >
          Submit
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },

  headerGrad: {
    paddingBottom: 12,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    overflow: "hidden",
  },
  appbar: { elevation: 0 },

  videoCard: {
    marginHorizontal: 14,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  video: {
    height: 180,
    borderRadius: 16,
  },
  playOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  playCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#0008",
    alignItems: "center",
    justifyContent: "center",
  },
  videoText: {
    position: "absolute",
    left: 16,
    top: 16,
  },
  videoTitle: { color: "#fff", fontWeight: "800" },
  videoSub: { color: "#e5e7eb", marginTop: 2 },

  progressBar: {
    height: 4,
    backgroundColor: "#ffffff40",
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 4,
  },
  progressFill: {
    height: 4,
    backgroundColor: "#8fbff8",
    borderRadius: 4,
  },
  timecode: {
    color: "#e5e7eb",
    textAlign: "right",
    marginRight: 12,
    marginTop: 4,
    marginBottom: 8,
    fontSize: 12,
  },

  content: {
    padding: 14,
    paddingBottom: 26,
    gap: 10,
  },

  // Keyframe block
  kfCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
  },
  kfHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  kfTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1b2a41",
  },
  positionBox: {
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: "#f1f5fb",
    paddingVertical: 10,
    alignItems: "center",
  },
  positionLabel: {
    color: "#64748b",
    fontSize: 12,
  },
  positionValue: {
    marginTop: 2,
    fontWeight: "800",
    color: "#111827",
  },
  kfRow: {
    borderRadius: 10,
    backgroundColor: "#f8fbff",
    padding: 8,
    borderWidth: 1,
    borderColor: "#e6eef9",
  },
  kfRowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  kfTime: {
    color: BLUE,
    fontWeight: "800",
  },
  kfInput: {
    marginTop: 6,
    backgroundColor: "#fff",
    minHeight: 80,
  },

  // Editor
  editorCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
  },
  editorInput: {
    minHeight: 160,
    backgroundColor: "#fff",
  },
  counter: {
    position: "absolute",
    right: 18,
    bottom: 16,
    color: "#6b7280",
    fontSize: 12,
  },

  submitBtn: {
    borderRadius: 10,
    backgroundColor: "#5d8aff",
    alignSelf: "center",
    width: "60%",
  },
});
