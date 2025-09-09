import React from 'react';
import { ScrollView, View, StyleSheet, Image } from 'react-native';
import { Card, Text, Button, Avatar, ProgressBar, Chip, Surface } from 'react-native-paper';
import { router, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../../utils/axiosInstance';
import EmptyStatus from '../../../../components/EmptyStatus'; // Adjust path as needed
import LoadingOverlay from '../../../../components/LoadingOverlay'; // adjust path if needed
import { LinearGradient } from "expo-linear-gradient";
import { Pressable } from 'react-native-gesture-handler';


const themeColor = '#8fbff8';
const BG = "#f2f6fb";

export const screenOptions = {
  gestureEnabled: false, // or false to disable
};

type Item = {
  id: string;
  name: string;
  tags: string[];
  desc: string;
  status?: "New" | "Pending";
};

const myStudents: Item[] = [
  {
    id: "s1",
    name: "Sarah Chen",
    tags: ["Snowboard", "CASI", "Flow"],
    desc:
      "Having trouble with weight transfer during parallel turns. Need guidance on proper technique.",
    status: "New",
  },
];

const otherLearners: Item[] = [
  {
    id: "o1",
    name: "Alex Rodriguez",
    tags: ["Snowboard", "CASI", "Flow"],
    desc:
      "New to skiing, need help with basic pizza wedge technique for speed control.",
    status: "New",
  },
  {
    id: "o2",
    name: "David Kim",
    tags: ["Snowboard", "CASI", "Flow"],
    desc:
      "Transitioning to off-piste skiing. Looking for powder technique guidance.",
    status: "Pending",
  },
];

export default function Records() {
  const router = useRouter();
  const [inquiringList, setInquiringList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);


  React.useEffect(() => {
    fetchInquiringList();
  }, []);

  const fetchInquiringList = async () => {
    // const token = await AsyncStorage.getItem('authToken');
    setLoading(true);
    const { data } = await axiosInstance.get('/system/results/coach/list-inquiring').finally(() => {
      setLoading(false);
    });

    if (data.code === 200) {
      setInquiringList(data.data);
    }
  };

  return (

    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Feedback Dashboard</Text>

      {/* My Students */}
      <SectionHeader label="My Students" color="#2ea6ff" />
      {myStudents.length > 0 ? myStudents.map((it) => (
        <FeedbackCard key={it.id} item={it} />
      )) : <EmptyStatus />}

      {/* Other Learners */}
      <SectionHeader label="Other Learners" color="#22c55e" />
      {otherLearners.length > 0 ? otherLearners.map((it) => (
        <FeedbackCard key={it.id} item={it} />
      )) : <EmptyStatus />}
    </ScrollView>
  );
}

function FeedbackCard({ item }: { item: Item }) {
  return (
    <Pressable onPress={() => {router.push(`/page/coach/request/detail?studentId=${item.id}`)}} >
      <Surface style={styles.card} elevation={1}>
        {/* Video placeholder with play icon */}
        <View style={styles.videoWrap}>
          <LinearGradient
            colors={["#e9eef7", "#f5f7fb"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.video}
        />
        <View style={styles.playBadge}>
          <Avatar.Icon size={44} icon="play" color="#fff" style={{ backgroundColor: "#257AFD" }} />
        </View>

        {/* Floating tags */}
        <View style={styles.tagRow}>
          {item.tags.map((t, i) => (
            <TagChip key={`${item.id}-tag-${i}`} label={t} index={i} />
          ))}
        </View>
      </View>

      {/* Name + status */}
      <View style={styles.nameRow}>
        <Text style={styles.name}>{item.name}</Text>
        {item.status ? <StatusPill status={item.status} /> : null}
      </View>

      {/* Description */}
      <Text style={styles.desc}>{item.desc}</Text>
    </Surface>
    </Pressable>

  );
}

function TagChip({ label, index }: { label: string; index: number }) {
  // Style variations to mimic the mock (blue, outline, light blue)
  const variant =
    index === 0 ? "filled" : index === 1 ? "outline" : "light";

  if (variant === "filled") {
    return (
      <Chip compact style={styles.tagFilled} textStyle={styles.tagFilledText}>
        {label}
      </Chip>
    );
  }
  if (variant === "outline") {
    return (
      <Chip compact mode="outlined" style={styles.tagOutline} textStyle={styles.tagOutlineText}>
        {label}
      </Chip>
    );
  }
  return (
    <Chip compact style={styles.tagLight} textStyle={styles.tagLightText}>
      {label}
    </Chip>
  );
}

function StatusPill({ status }: { status: "New" | "Pending" }) {
  const isNew = status === "New";
  return (
    <View
      style={[
        styles.pill,
        {
          backgroundColor: isNew ? "#fff7ed" : "#e7f0ff",
          borderColor: isNew ? "#fdba74" : "#93c5fd",
        },
      ]}
    >
      <Text
        style={[
          styles.pillText,
          { color: isNew ? "#c2410c" : "#1d4ed8" },
        ]}
      >
        {status}
      </Text>
    </View>
  );
}

function SectionHeader({ label, color }: { label: string; color: string }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.sectionText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },
  content: {
    padding: 14,
    paddingBottom: 28,
    gap: 12,
  },

  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginTop: 4,
    marginBottom: 8,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    marginBottom: 6,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  sectionText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1f2937",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },

  videoWrap: {
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
  },
  video: {
    height: 140,
    borderRadius: 16,
  },
  playBadge: {
    position: "absolute",
    alignSelf: "center",
    top: 48,
  },

  tagRow: {
    position: "absolute",
    left: 10,
    bottom: 8,
    flexDirection: "row",
    gap: 6,
  },

  // Tag variants
  tagFilled: {
    backgroundColor: "#5bbcff",
    borderRadius: 14,
    height: 28,
  },
  tagFilledText: { color: "#fff", fontWeight: "700" },

  tagOutline: {
    backgroundColor: "#fff",
    borderColor: "#c9d3e6",
    borderWidth: 1,
    borderRadius: 14,
    height: 28,
  },
  tagOutlineText: { color: "#1f2937", fontWeight: "700" },

  tagLight: {
    backgroundColor: "#cfeaff",
    borderRadius: 14,
    height: 28,
  },
  tagLightText: { color: "#0b63c6", fontWeight: "700" },

  nameRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontWeight: "700",
    color: "#232f3e",
  },

  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "700",
  },

  desc: {
    marginTop: 6,
    color: "#4b5563",
    lineHeight: 18,
  },
});
