import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Image, Platform, Pressable } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Surface,
  Checkbox,
  HelperText,
  Menu,
  Divider,
  PaperProvider
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";

const themeBlue = "#257AFD";
const lightBG = "#f2f6fb";

export default function CertificationForm() {
  const router = useRouter();

  // Basic Identity
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState<string | null>(null);
  const [showGenderMenu, setShowGenderMenu] = useState(false);
  const [dob, setDob] = useState<Date | null>(null);
  const [dobText, setDobText] = useState("");
  const [showDate, setShowDate] = useState(false);
  const [phone, setPhone] = useState("");
  const [wechat, setWeChat] = useState("");

  // Identity & Qualification
  const [idFront, setIdFront] = useState<string | null>(null);
  const [idBack, setIdBack] = useState<string | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [certTypeNum, setCertTypeNum] = useState("");
  const [certScan, setCertScan] = useState<string | null>(null);

  // Teaching Experience
  const [years, setYears] = useState("");
  const [resorts, setResorts] = useState("");
  const [level, setLevel] = useState<string | null>(null);
  const [showLevelMenu, setShowLevelMenu] = useState(false);
  const [emergency, setEmergency] = useState("");

  // Commitment
  const [agree, setAgree] = useState(false);
  const [signature, setSignature] = useState("");

  // Errors (simple)
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);

  const pickImage = async (setter: (uri: string | null) => void) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access photos is required.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!res.canceled) {
      setter(res.assets[0].uri);
    }
  };

  const formatDate = (d: Date) => {
    // yyyy/mm/dd to match screenshot style
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, "0");
    const da = `${d.getDate()}`.padStart(2, "0");
    return `${y} / ${m} / ${da}`;
  };

  const validate = () => {
    const ok =
      !!fullName &&
      !!gender &&
      !!dob &&
      !!phone &&
      !!idFront &&
      !!idBack &&
      !!selfie &&
      !!certTypeNum &&
      !!certScan &&
      !!years &&
      !!resorts &&
      !!level &&
      !!emergency &&
      agree &&
      !!signature;
    return ok;
  };

  const onSubmit = async () => {
    setTouched(true);
    if (!validate()) {
      // Minimal UX; in your app hook into a toast/snackbar
      alert("Please complete all required fields and check the commitment box.");
      return;
    }
    try {
      setSubmitting(true);
      // TODO: upload images & submit to API
      // Example payload
      const payload = {
        fullName,
        gender,
        dob: dob?.toISOString(),
        phone,
        wechatOrPaypal: wechat,
        certTypeNum,
        years,
        resorts,
        level,
        emergency,
        agree,
        signature,
        // images: idFront, idBack, selfie, certScan
      };
      console.log("Submit payload:", payload);
      // await axios.post("https://your.api/coach/apply", formData)
      alert("Application submitted!");
      router.back();
    } catch (e) {
      alert("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Surface style={styles.card} elevation={1}>
        <Text style={styles.title}>Skiing Coach Certification Application</Text>

        {/* 1. Basic Identity Information */}
        <SectionHeader index={1} title="Basic Identity Information" />
        <TextInput
          label="Full Name"
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
          mode="outlined"
        />
            <PaperProvider>
            <Menu
            visible={showGenderMenu}
            onDismiss={() => setShowGenderMenu(false)}
            anchorPosition="bottom"
            anchor={<Pressable onPress={() => setShowGenderMenu(true)}>
                <TextInput
                    label="Gender"
                        value={gender || ""}
                        placeholder="Select gender"
                        right={<TextInput.Icon icon="menu-down" />}
                        mode="outlined"
                        style={[styles.input, { flex: 1 }]}
                        editable={false}          // don't open keyboard
                        pointerEvents="none"      // make the whole tile pressable via Pressable
                    />
                </Pressable>
            }>

            {["Male", "Female", "Other", "Prefer not to say"].map((g) => (
                <Menu.Item
                key={g}
                onPress={() => {
                    setGender(g);
                    setShowGenderMenu(false);
                }}
                title={g}
                />
            ))}
        </Menu>
            </PaperProvider>

          <TextInput
            label="Date of Birth"
            placeholder="YYYY / MM / DD"
            value={dobText}
            mode="outlined"
            style={[styles.input, { flex: 1 }]}
            right={<TextInput.Icon icon="calendar" onPress={() => setShowDate(true)} />}
            onFocus={() => setShowDate(true)}
          />

        {showDate && (
          <DateTimePicker
            value={dob ?? new Date(2000, 0, 1)}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_, selected) => {
              setShowDate(Platform.OS === "ios");
              if (selected) {
                setDob(selected);
                setDobText(formatDate(selected));
                setShowDate(false);
              }
            }}
          />
        )}
        <TextInput
          label="Phone Number"
          placeholder="Enter your phone number"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          keyboardType="phone-pad"
          mode="outlined"
        />

        {/* 2. Identity & Qualification Verification */}
        <SectionHeader index={2} title="Identity & Qualification Verification" />

        <Text style={styles.label}>ID Card (Front & Back Photos)</Text>
        <View style={styles.uploadRow}>
          <UploadTile
            label="Front"
            uri={idFront}
            onPick={() => pickImage(setIdFront)}
          />
          <UploadTile
            label="Back"
            uri={idBack}
            onPick={() => pickImage(setIdBack)}
          />
        </View>

        <Text style={styles.label}>Face Selfie Photo</Text>
        <UploadTile
          label="Upload selfie"
          uri={selfie}
          onPick={() => pickImage(setSelfie)}
        />

        <Text style={styles.label}>Certificate Scan</Text>
        <UploadTile
          label="Upload certificate"
          uri={certScan}
          onPick={() => pickImage(setCertScan)}
        />

        {/* 3. Teaching Experience Information */}
        <SectionHeader index={3} title="Teaching Experience Information" />
        <TextInput
          label="Years of Skiing Experience"
          placeholder="Enter years of experience"
          value={years}
          onChangeText={setYears}
          style={styles.input}
          keyboardType="numeric"
          mode="outlined"
        />
        <TextInput
          label="Ski Resorts Served (List 3 or more)"
          placeholder="List the ski resorts where you have worked..."
          value={resorts}
          onChangeText={setResorts}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={4}
        />

        <PaperProvider>

        <Menu
          visible={showLevelMenu}
          onDismiss={() => setShowLevelMenu(false)}
          anchor={
            <TextInput
              label="Teaching Level"
              placeholder="Select teaching level"
              value={level || ""}
              right={<TextInput.Icon icon="menu-down" />}
              mode="outlined"
              style={styles.input}
              onFocus={() => setShowLevelMenu(true)}
            />
          }
        >
          {[
            "Beginner",
            "Intermediate",
            "Advanced",
            "CASI Level 1",
            "CASI Level 2",
            "BASI Level 1",
            "BASI Level 2",
            "PSIA/AASI L1",
            "PSIA/AASI L2",
          ].map((lv) => (
            <Menu.Item
              key={lv}
              onPress={() => {
                setLevel(lv);
                setShowLevelMenu(false);
              }}
              title={lv}
            />
          ))}
        </Menu>
        </PaperProvider>

        {/* 4. Commitment Statement */}
        <SectionHeader index={4} title="Commitment Statement" />
        <View style={styles.commitRow}>
          <Checkbox
            status={agree ? "checked" : "unchecked"}
            onPress={() => setAgree(!agree)}
          />
          <Text style={styles.commitText}>
            I promise that all the information and materials filled in and
            submitted above are true and valid. If there is any falsification, I
            will bear all legal and platform responsibilities arising therefrom.
          </Text>
        </View>
        {touched && !agree && (
          <HelperText type="error" visible>
            You must agree before submitting.
          </HelperText>
        )}

        <Text style={[styles.label, { marginTop: 12 }]}>Digital Signature</Text>
        <TextInput
          placeholder="Type your full name as a signature"
          value={signature}
          onChangeText={setSignature}
          style={styles.input}
          mode="outlined"
        />

        <Divider style={{ marginVertical: 8 }} />

        <Button
          mode="contained"
          buttonColor={themeBlue}
          textColor="#fff"
          style={styles.submitBtn}
          onPress={onSubmit}
          loading={submitting}
          disabled={submitting}
        >
          Submit Application
        </Button>
      </Surface>
    </ScrollView>
  );
}

function SectionHeader({ index, title }: { index: number; title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionIndex}>{index}.</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function UploadTile({
  label,
  uri,
  onPick,
}: {
  label: string;
  uri: string | null;
  onPick: () => void;
}) {
  return (
    <Surface style={styles.upload} elevation={0}>
      {uri ? (
        <Image source={{ uri }} style={styles.uploadPreview} />
      ) : (
        <Button
          mode="text"
          icon="image-multiple"
          onPress={onPick}
          textColor="#5b6d7f"
        >
          {`Click to upload ${label.toLowerCase()}`}
        </Button>
      )}
    </Surface>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: lightBG,
    paddingTop: 60,
    paddingBottom: 32,
    padding: 12,
  },
  card: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
    color: "#1b2a41",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 6,
    gap: 6,
  },
  sectionIndex: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1b2a41",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1b2a41",
  },

  label: {
    fontSize: 13,
    marginTop: 8,
    marginBottom: 4,
    color: "#3b4a5a",
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  input: {
    backgroundColor: "#fff",
    marginTop: 8,
  },

  uploadRow: {
    flexDirection: "row",
    gap: 10,
  },
  upload: {
    flex: 1,
    height: 110,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#cdd8e5",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafcff",
  },
  uploadPreview: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },

  commitRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginTop: 4,
  },
  commitText: {
    flex: 1,
    color: "#3b4a5a",
    lineHeight: 20,
  },

  submitBtn: {
    marginTop: 12,
    borderRadius: 10,
  },
});
