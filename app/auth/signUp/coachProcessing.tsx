import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  Surface,
  Button,
  Avatar,
  Appbar,
  Card,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const BLUE = "#257AFD";
const BG = "#f2f6fb";

export default function ApplicationProcessing() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Top bar */}
      <Appbar.Header style={styles.appbar} statusBarHeight={0}>
        <Appbar.Action icon="arrow-left" onPress={() => router.back()} />
        <View style={styles.headerCenter}>
          <Avatar.Icon size={48} icon="timer-sand" color="#fff" style={styles.badge} />
        </View>
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Title block */}
        <Surface style={styles.headCard} elevation={1}>
          <Text style={styles.title}>Application Processing</Text>
          <Text style={styles.subtitle}>Your Coach Application is Under Review</Text>
          <Text style={styles.lead}>
            Your application to become a certified coach has been successfully submitted and is
            currently being processed by our team.
          </Text>

          {/* Thin progress line */}
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </Surface>

        {/* What's Next */}
        <Card mode="elevated" style={styles.nextCard}>
          <Card.Content>
            <Text style={styles.nextTitle}>What’s Next:</Text>

            <NextItem index={1} text="Application review and verification (3–5 business days)" />
            <NextItem index={2} text="Email confirmation with approval status" />
            <NextItem index={3} text="Login credentials for coach dashboard access" />
          </Card.Content>
        </Card>

        {/* Green banner */}
        <Surface style={styles.banner} elevation={0}>
          <Text style={styles.bannerText}>
            Thank you for your patience during this process. We’re excited to have you join our
            coaching community!
          </Text>
        </Surface>
      </ScrollView>
    </View>
  );
}

function NextItem({ index, text }: { index: number; text: string }) {
  return (
    <View style={styles.nextRow}>
      <View style={styles.bullet}>
        <Text style={styles.bulletText}>{index}</Text>
      </View>
      <Text style={styles.nextText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },
  appbar: {
    backgroundColor: BG,
    elevation: 0,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  badge: {
    backgroundColor: BLUE,
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 14,
  },

  headCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "800",
    color: "#101828",
  },
  subtitle: {
    textAlign: "center",
    marginTop: 6,
    fontSize: 15,
    fontWeight: "700",
    color: BLUE,
  },
  lead: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    color: "#46566e",
  },
  progressTrack: {
    marginTop: 14,
    height: 3,
    width: "100%",
    backgroundColor: "#e6eef9",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    width: "65%", // adjust if you want a different progress feel
    backgroundColor: BLUE,
  },

  nextCard: {
    borderRadius: 16,
    backgroundColor: "#ffffff",
  },
  nextTitle: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "800",
    color: "#1b2a41",
    marginBottom: 10,
  },
  nextRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  bullet: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#e8f1ff",
    borderColor: BLUE,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  bulletText: {
    color: BLUE,
    fontWeight: "800",
    fontSize: 13,
  },
  nextText: {
    flex: 1,
    fontSize: 14,
    color: "#3b4a5a",
  },

  banner: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#dcfce7", // soft green
    borderWidth: 1,
    borderColor: "#86efac",
  },
  bannerText: {
    textAlign: "center",
    color: "#166534",
    lineHeight: 20,
    fontSize: 14,
  },
});
