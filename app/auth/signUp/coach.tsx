import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, Button, Surface, Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';

const themeColor = '#8fbff8';

export default function CoachLanding() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Hero */}
      <Surface style={styles.hero} elevation={1}>
        <Text style={styles.heroTitle}>Become a Certified Coach</Text>
        <Text style={styles.heroSubtitle}>
          Transform your passion for skiing into a rewarding career. Join our
          community of expert instructors and make a difference in people’s
          lives while earning substantial income.
        </Text>
      </Surface>

      {/* Section title */}
      <Text style={styles.sectionTitle}>Why Choose to Coach With Us?</Text>

      {/* Benefit cards */}
      <View style={styles.cardStack}>
        <BenefitCard
          icon="cash-multiple"
          iconColor="#18a957"
          title="Substantial Revenue"
          body={
            <>
              Earn an average of{' '}
              <Text style={styles.moneyHighlight}>$1,000</Text> per month
              through our flexible coaching platform. Set your own rates and
              schedule.
            </>
          }
        />
        <BenefitCard
          icon="star"
          iconColor="#ff9f43"
          title="Build Your Reputation"
          body="Gain popularity and build a loyal fan base from learners both online and in-person. Showcase your expertise and grow your personal brand."
        />
        <BenefitCard
          icon="home-account"
          iconColor="#8e6cff"
          title="Work From Home Flexibility"
          body="Perfect for certified coaches who want to teach from the comfort of their home. Balance your passion with your lifestyle."
        />
      </View>

      {/* CTA */}
      <Surface style={styles.ctaBlock} elevation={1}>
        <Text style={styles.ready}>Are You Ready?</Text>
        <Button
          mode="contained"
          buttonColor="#257AFD"
          textColor="#fff"
          style={styles.ctaBtn}
          onPress={() => router.push('/auth/signUp/coachForm')}
        >
          Continue
        </Button>
      </Surface>
    </ScrollView>
  );
}

function BenefitCard({
  icon,
  iconColor,
  title,
  body,
}: {
  icon: string;
  iconColor: string;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <Surface style={styles.card} elevation={2}>
      <View style={styles.cardHeader}>
        <Avatar.Icon size={36} icon={icon} color="#fff" style={{ backgroundColor: iconColor }} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <Text style={styles.cardBody}>{body}</Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f2f6fb',
    gap: 16,
  },

  // Hero
  hero: {
    marginTop: 48,
    backgroundColor: '#eaf3ff',
    borderRadius: 16,
    padding: 18,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2170e7',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4b5b70',
  },

  // Section
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a2940',
    marginTop: 4,
  },

  cardStack: { gap: 12 },

  // Card
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e2b3c',
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4b5b70',
  },
  moneyHighlight: {
    fontWeight: '900',
    fontSize: 18,
    color: '#10b981', // green highlight for $1,000
  },

  // CTA
  ctaBlock: {
    width: '100%',
    backgroundColor: '#eaf3ff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  ready: {
    fontSize: 14,
    color: '#4b5b70',
    marginBottom: 8,
  },
  ctaBtn: {
    alignSelf: 'stretch',
    borderRadius: 10,
  },
});
