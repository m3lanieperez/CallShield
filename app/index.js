import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '../constants/theme';
 
function PowerButton({ isOn, onPress }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
 
  useEffect(() => {
    if (isOn) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 1400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isOn]);
 
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.94,
      useNativeDriver: true,
    }).start();
  };
 
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };
 
  const buttonColor = isOn ? Colors.deepTeal : '#1C2A28';
  const ringColor = isOn ? Colors.midTeal : '#2A3E3A';
 
  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }], alignItems: 'center' }}>
        <Animated.View
          style={[
            styles.pulseRing,
            {
              borderColor: ringColor,
              transform: [{ scale: pulseAnim }],
              opacity: isOn ? 0.35 : 0.15,
            },
          ]}
        />
        <View style={[styles.midRing, { borderColor: ringColor, opacity: isOn ? 0.6 : 0.2 }]} />
        <View style={[styles.buttonBody, { backgroundColor: buttonColor, borderColor: ringColor }]}>
          <Ionicons
            name="power"
            size={50}
            color={isOn ? Colors.lightTeal : Colors.midGray}
          />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}
 
function BackendBadge({ status }) {
  const color =
    status === 'connected'
      ? Colors.safe
      : status === 'checking'
      ? Colors.unknown
      : Colors.risky;
  const label =
    status === 'connected'
      ? '● Backend connected'
      : status === 'checking'
      ? '◌ Checking backend…'
      : '○ Backend offline';
 
  return (
    <View style={[styles.badge, { borderColor: color }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}
 
export default function HomeScreen() {
  const [isOn, setIsOn] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const router = useRouter();
 
  const BACKEND_URL = 'http://localhost:8000';
 
  useEffect(() => {
    pingBackend();
  }, []);
 
  async function pingBackend() {
    try {
      setBackendStatus('checking');
      const res = await fetch(`${BACKEND_URL}/ping`, { 
        signal: AbortSignal.timeout(4000) 
      });
      if (res.ok) {
        setBackendStatus('connected');
      } else {
        setBackendStatus('offline');
      }
    } catch {
      setBackendStatus('offline');
    }
  }
 
  function handleToggle() {
    setIsOn(prev => !prev);
  }
 
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Backend status badge */}
        <BackendBadge status={backendStatus} />
 
        {/* Spacer */}
        <View style={styles.spacer} />
 
        {/* Status text */}
        <Text style={[styles.statusLabel, { color: isOn ? Colors.lightTeal : Colors.midGray }]}>
          {isOn ? 'Protection active' : 'Protection off'}
        </Text>
 
        {/* Control buttons row - Tutorial on left, Power on right */}
        <View style={styles.buttonsRow}>
          {/* Tutorial button */}
          <TouchableOpacity
            style={styles.tutorialButton}
            onPress={() => Alert.alert('Tutorial', 'Coming soon — Coach marks will guide you through the app!')}
          >
            <Ionicons name="help-circle-outline" size={24} color={Colors.eucalyptus} />
            <Text style={styles.tutorialButtonText}>Tutorial</Text>
          </TouchableOpacity>
 
          {/* Power button */}
          <View style={styles.powerButtonContainer}>
            <PowerButton isOn={isOn} onPress={handleToggle} />
          </View>
        </View>
 
        <Text style={styles.buttonHint}>
          {isOn ? 'Tap to disable' : 'Tap to enable'}
        </Text>
 
        <View style={styles.spacer} />
 
        {/* Info card */}
        <View style={[styles.infoCard, { borderColor: isOn ? Colors.safeBorder : Colors.lightGray }]}>
          <Ionicons
            name={isOn ? 'shield-checkmark' : 'shield-outline'}
            size={20}
            color={isOn ? Colors.midTeal : Colors.midGray}
          />
          <Text style={[styles.infoText, { color: isOn ? Colors.darkGray : Colors.midGray }]}>
            {isOn
              ? 'CallShield is analyzing incoming calls.'
              : 'Enable protection to start monitoring incoming calls.'}
          </Text>
        </View>
 
        {/* Navigation buttons */}
        <View style={styles.navButtons}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => router.push('/data')}
          >
            <Ionicons name="document-text-outline" size={20} color={Colors.eucalyptus} />
            <Text style={styles.navButtonText}>Call History</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => router.push('/permissions')}
          >
            <Ionicons name="lock-closed-outline" size={20} color={Colors.eucalyptus} />
            <Text style={styles.navButtonText}>Permissions</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
 
const BUTTON_SIZE = 120;
const RING_1 = BUTTON_SIZE + 30;
const RING_2 = BUTTON_SIZE + 60;
 
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.offWhite,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  badge: {
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  spacer: {
    flex: 1,
  },
  statusLabel: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    letterSpacing: 0.4,
    marginBottom: Spacing.lg,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  tutorialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  tutorialButtonText: {
    fontSize: FontSize.sm,
    color: Colors.eucalyptus,
    fontWeight: '500',
  },
  powerButtonContainer: {
    alignItems: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: RING_2,
    height: RING_2,
    borderRadius: RING_2 / 2,
    borderWidth: 3,
  },
  midRing: {
    position: 'absolute',
    width: RING_1,
    height: RING_1,
    borderRadius: RING_1 / 2,
    borderWidth: 4,
  },
  buttonBody: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.deepTeal,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  buttonHint: {
    marginTop: Spacing.sm,
    fontSize: FontSize.xs,
    color: Colors.midGray,
    letterSpacing: 0.3,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.md,
    width: '100%',
  },
  infoText: {
    flex: 1,
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  navButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
    width: '100%',
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: Radius.md,
    padding: Spacing.md,
    justifyContent: 'center',
  },
  navButtonText: {
    fontSize: FontSize.sm,
    color: Colors.eucalyptus,
    fontWeight: '500',
  },
});