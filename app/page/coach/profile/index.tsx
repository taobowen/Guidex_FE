import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Platform,
} from "react-native";
import {
  Text,
  Surface,
  Avatar,
  Button,
  Chip,
  IconButton,
  Card,
  Divider,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
// import axiosInstance from "@/app/utils/axiosInstance"; // wire up as needed

const BLUE = "#257AFD";
const BG = "#f2f6fb";

type Invite = {
  id: string;
  name: string;
  ago: string;
  text: string;
};

type Review = {
  id: string;
  name: string;
  rating: number; // 1..5
  ago: string;
  text: string;
};

export default function CoachProfile() {
  // --- Profile data (replace with API data) ---
  const [videoUri, setVideoUri] = React.useState<string | null>(null);
  const [avatarUri, setAvatarUri] = React.useState<string | null>(null);
  const [name, setName] = React.useState("Sarah Johnson");
  const [gender, setGender] = React.useState("Female");
  const [score, setScore] = React.useState(4.8);
  const [avgResponse, setAvgResponse] = React.useState("2.5 hrs");
  const [totalInquiries, setTotalInquiries] = React.useState(247);
  const [certs, setCerts] = React.useState<string[]>([
    "Certified Life Coach",
    "NLP Practitioner",
    "Career Counselor",
  ]);
  const [about, setAbout] = React.useState(
    "Passionate life coach with 8+ years of experience helping individuals achieve their personal and professional goals. Specialized in career transitions, confidence building, and work-life balance."
  );

  const [tab, setTab] = React.useState<"invites" | "reviews">("invites");

  const invites: Invite[] = [
    {
      id: "i1",
      name: "Alex Chen",
      ago: "2 hours ago",
      text:
        '“Hi Sarah! I’m looking for guidance with my career transition from marketing to UX design. Your profile really resonates with me. Would you be interested in being my mentor?”',
    },
    {
      id: "i2",
      name: "Maria Rodriguez",
      ago: "1 day ago",
      text:
        '“I’m struggling with work-life balance as a new mom returning to work. I’d love your guidance and support.”',
    },
  ];

  const reviews: Review[] = [
    {
      id: "r1",
      name: "Daniel Park",
      rating: 5,
      ago: "3 days ago",
      text: "Amazing clarity and actionable steps. Feeling more confident already.",
    },
    {
      id: "r2",
      name: "Liu Wei",
      rating: 4,
      ago: "1 week ago",
      text: "Very helpful session. Will book again to refine my plan.",
    },
  ];

  // --- Handlers ---
  const pickHeaderVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media is required.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.8,
    });
    if (!res.canceled) {
      setVideoUri(res.assets[0].uri);
      // TODO: upload via your API/S3
    }
  };

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access photos is required.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!res.canceled) {
      setAvatarUri(res.assets[0].uri);
      // TODO: upload avatar
    }
  };

  const acceptInvite = async (id: string) => {
    // await axiosInstance.post(`/coach/invites/${id}/accept`)
    alert("Invite accepted ✅");
  };
  const declineInvite = async (id: string) => {
    // await axiosInstance.post(`/coach/invites/${id}/decline`)
    alert("Invite declined ❌");
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Header: gradient + upload */}
      <Surface style={styles.headerCard} elevation={0}>
        <LinearGradient
          colors={["#6366f1", "#7c3aed"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGrad}
        >
          <Pressable style={styles.headerTap} onPress={pickHeaderVideo}>
            <Text style={styles.headerTapText}>
              {videoUri ? "Video selected • Tap to change" : "Click to upload coach video"}
            </Text>
          </Pressable>
          <Pressable style={styles.editVideoBtn} onPress={pickHeaderVideo}>
            <Text style={styles.editVideoText}>Edit Video</Text>
          </Pressable>
        </LinearGradient>
      </Surface>

      {/* Avatar + name */}
      <View style={styles.avatarWrap}>
        <Pressable onPress={pickAvatar}>
          <View>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
            ) : (
              <Avatar.Icon size={88} icon="account" />
            )}
            <View style={styles.badgeDot}>
              <Avatar.Icon size={18} icon="pencil" color="#fff" style={{ backgroundColor: BLUE }} />
            </View>
          </View>
        </Pressable>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{name}</Text>
          <Button compact mode="text" onPress={() => alert("Edit name")}>
            Edit
          </Button>
        </View>
      </View>

      {/* Stat cards */}
      <View style={styles.statGrid}>
        <StatCard
          label="GENDER"
          value={gender}
          right={<Button compact mode="text" onPress={() => alert("Edit gender")}>Edit</Button>}
        />
        <StatCard
          label="SCORE"
          value={`${score.toFixed(1)} ⭐`}
        />
        <StatCard label="AVG RESPONSE" value={avgResponse} />
      </View>

      <Surface style={styles.totalCard} elevation={1}>
        <Text style={styles.totalLabel}>TOTAL INQUIRIES</Text>
        <Text style={styles.totalValue}>{totalInquiries}</Text>
      </Surface>

      {/* Certifications */}
      <Surface style={styles.block} elevation={1}>
        <View style={styles.blockHeader}>
          <Text style={styles.blockTitle}>Certifications</Text>
          <Button compact mode="text" onPress={() => alert("Edit certifications")}>
            Edit
          </Button>
        </View>
        <View style={styles.chipRow}>
          {certs.map((c) => (
            <Chip key={c} style={styles.certChip} textStyle={{ color: "#fff", fontWeight: "700" }}>
              {c}
            </Chip>
          ))}
        </View>
      </Surface>

      {/* About me */}
      <Surface style={styles.block} elevation={1}>
        <View style={styles.blockHeader}>
          <Text style={styles.blockTitle}>About Me</Text>
          <Button compact mode="text" onPress={() => alert("Edit about me")}>
            Edit
          </Button>
        </View>
        <Text style={styles.aboutText}>{about}</Text>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          <Pressable onPress={() => setTab("invites")} style={styles.tabBtn}>
            <Text style={[styles.tabText, tab === "invites" && styles.tabTextActive]}>
              Binding invitations (3)
            </Text>
            {tab === "invites" && <View style={styles.tabUnderline} />}
          </Pressable>
          <Pressable onPress={() => setTab("reviews")} style={styles.tabBtn}>
            <Text style={[styles.tabText, tab === "reviews" && styles.tabTextActive]}>
              Reviews & Comments (12)
            </Text>
            {tab === "reviews" && <View style={styles.tabUnderline} />}
          </Pressable>
        </View>

        {/* Tab content */}
        <View style={{ marginTop: 8, gap: 12 }}>
          {tab === "invites"
            ? invites.map((it) => (
                <Card key={it.id} style={styles.inviteCard} mode="elevated">
                  <Card.Title
                    title={it.name}
                    titleStyle={styles.inviteName}
                    subtitle={it.ago}
                    left={(props) => <Avatar.Text {...props} size={36} label={it.name.split(" ").map(w => w[0]).slice(0,2).join("")} />}
                  />
                  <Card.Content>
                    <Text style={styles.inviteText}>{it.text}</Text>
                  </Card.Content>
                  <View style={styles.inviteActions}>
                    <Button
                      mode="contained"
                      buttonColor="#22c55e"
                      textColor="#fff"
                      onPress={() => acceptInvite(it.id)}
                      style={{ borderRadius: 8 }}
                    >
                      Accept
                    </Button>
                    <Button
                      mode="contained"
                      buttonColor="#ef4444"
                      textColor="#fff"
                      onPress={() => declineInvite(it.id)}
                      style={{ borderRadius: 8 }}
                    >
                      Decline
                    </Button>
                  </View>
                </Card>
              ))
            : reviews.map((rv) => (
                <Card key={rv.id} style={styles.reviewCard} mode="elevated">
                  <Card.Title
                    title={rv.name}
                    subtitle={rv.ago}
                    left={(props) => <Avatar.Text {...props} size={36} label={rv.name.split(" ").map(w => w[0]).slice(0,2).join("")} />}
                    right={() => <Stars n={rv.rating} />}
                  />
                  <Card.Content>
                    <Text style={styles.reviewText}>{rv.text}</Text>
                  </Card.Content>
                </Card>
              ))}
        </View>
      </Surface>
    </ScrollView>
  );
}

function StatCard({
  label,
  value,
  right,
}: {
  label: string;
  value: string;
  right?: React.ReactNode;
}) {
  return (
    <Surface style={styles.statCard} elevation={1}>
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>{label}</Text>
        {right}
      </View>
      <Text style={styles.statValue}>{value}</Text>
    </Surface>
  );
}

function Stars({ n }: { n: number }) {
  const full = Math.floor(n);
  const half = n - full >= 0.5;
  const arr = [1, 2, 3, 4, 5].map((i) =>
    i <= full ? "star" : half && i === full + 1 ? "star-half-full" : "star-outline"
  );
  return (
    <View style={{ flexDirection: "row", paddingRight: 8 }}>
      {arr.map((icon, i) => (
        <IconButton
          key={i}
          icon={icon as any}
          size={18}
          disabled
          iconColor="#f59e0b"
          style={{ margin: 0 }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },
  content: { paddingBottom: 28 },

  headerCard: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: "hidden",
  },
  headerGrad: {
    height: 160,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTap: { padding: 8, paddingHorizontal: 16, borderRadius: 8 },
  headerTapText: { color: "#eaf2ff", fontWeight: "700" },
  editVideoBtn: {
    position: "absolute",
    right: 12,
    top: 12,
    backgroundColor: "#ffffff44",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  editVideoText: { color: "#fff", fontWeight: "700" },

  avatarWrap: {
    alignItems: "center",
    marginTop: -44,
  },
  avatarImg: { width: 88, height: 88, borderRadius: 44 },
  badgeDot: {
    position: "absolute",
    right: -2,
    bottom: -2,
    borderRadius: 12,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },

  statGrid: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: { color: "#6b7280", fontSize: 12, fontWeight: "700" },
  statValue: { marginTop: 6, fontWeight: "800", color: "#111827" },

  totalCard: {
    marginTop: 10,
    marginHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
  },
  totalLabel: { color: "#6b7280", fontSize: 12, fontWeight: "700" },
  totalValue: { marginTop: 6, fontWeight: "800", color: "#111827", fontSize: 18 },

  block: {
    marginTop: 12,
    marginHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
  },
  blockHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  blockTitle: { fontSize: 16, fontWeight: "800", color: "#1f2937" },

  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  certChip: {
    backgroundColor: BLUE,
    borderRadius: 999,
  },

  aboutText: {
    marginTop: 8,
    color: "#374151",
    lineHeight: 20,
  },

  tabsRow: {
    flexDirection: "row",
    gap: 18,
    marginTop: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
  tabBtn: { paddingBottom: 6 },
  tabText: { color: "#6b7280", fontWeight: "700" },
  tabTextActive: { color: BLUE },
  tabUnderline: {
    height: 3,
    backgroundColor: BLUE,
    borderRadius: 3,
    marginTop: 6,
  },

  inviteCard: {
    borderRadius: 12,
    overflow: "hidden",
  },
  inviteName: { fontWeight: "800" },
  inviteText: { color: "#374151", lineHeight: 20 },
  inviteActions: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    paddingTop: 6,
  },

  reviewCard: { borderRadius: 12, overflow: "hidden" },
  reviewText: { color: "#374151", lineHeight: 20 },
});
