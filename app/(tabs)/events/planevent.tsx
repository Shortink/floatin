import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import SimpleDropdown, { Option } from "../../../components/SimpleDropDown";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/auth";
import { useRouter } from "expo-router";

export default function PlanEventScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const months = [
    { label: "January", value: "January" },
    { label: "February", value: "February" },
    { label: "March", value: "March" },
    { label: "April", value: "April" },
    { label: "May", value: "May" },
    { label: "June", value: "June" },
    { label: "July", value: "July" },
    { label: "August", value: "August" },
    { label: "September", value: "September" },
    { label: "October", value: "October" },
    { label: "November", value: "November" },
    { label: "December", value: "December" },
  ];
  const currentDate = new Date();
  const curDay = currentDate.getDate().toString();
  const curYear = currentDate.getFullYear().toString();

  const [month, setMonth] = useState<Option>(months[currentDate.getMonth()]);
  const [day, setDay] = useState<Option>({ label: curDay, value: curDay });
  const [year, setYear] = useState<Option>({ label: curYear, value: curYear });

  const [hour, setHour] = useState<Option>({ label: "12", value: 12 });
  const [minute, setMinute] = useState<Option>({ label: "10", value: 10 });
  const [ampm, setAmPm] = useState<Option>({ label: "PM", value: "PM" });

  const [eventTitle, setEventTitle] = useState("");
  const [location, setLocation] = useState("");
  const [friend, setFriend] = useState("");
  const [description, setDescription] = useState("");
  const days: Option[] = Array.from({ length: 31 }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1,
  }));

  const years: Option[] = Array.from({ length: 4 }, (_, i) => ({
    label: `${Number(curYear) + i}`,
    value: Number(curYear) + i,
  }));

  const hours: Option[] = Array.from({ length: 12 }, (_, i) => ({
    label: `${i === 0 ? 12 : i}`,
    value: i === 0 ? 12 : i,
  }));

  const minutes: Option[] = Array.from({ length: 12 }, (_, i) => {
    const minute = i * 5;
    return {
      label: minute < 10 ? `0${minute}` : `${minute}`,
      value: minute,
    };
  });

  const ampmOptions: Option[] = [
    { label: "AM", value: "AM" },
    { label: "PM", value: "PM" },
  ];

  const getEventDate = () => {
    const monthIndex = months.findIndex((m) => m.value === month.value);
    let hour24 = hour.value as number;
    if (ampm.value === "PM" && hour24 < 12) hour24 += 12;
    if (ampm.value === "AM" && hour24 === 12) hour24 = 0;

    return new Date(
      Number(year.value),
      monthIndex,
      Number(day.value),
      hour24,
      Number(minute.value),
      0
    );
  };

  const createEvent = async () => {
    const { data, error } = await supabase.from("events").insert({
      created_by: user.id,
      title: eventTitle,
      location: location,
      description: description,
      datetime: getEventDate().toISOString(),
    });
    if (error) {
      console.error("Error inserting event:", error);
    } else {
      console.log("Event created:", data);
      setShowSuccess(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // After 2s fade out
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setShowSuccess(false); // Hide after fade out finishes
        });
      }, 2000);
    }
  };
  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: "#FFF6F3" }}
    >
      <LinearGradient colors={["#FFF6F3", "#e9f5ec"]} style={styles.topView}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()}>
            <Entypo name="chevron-left" size={50} color="black" />
          </Pressable>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>Plan Event</Text>
        </View>
      </LinearGradient>
      <ScrollView
        style={{ flex: 1, backgroundColor: "#FFF6F3" }}
        contentContainerStyle={styles.container}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <TextInput
            style={styles.input}
            placeholder="Event Title"
            placeholderTextColor="#949494"
            value={eventTitle}
            onChangeText={setEventTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Location"
            placeholderTextColor="#949494"
            value={location}
            onChangeText={setLocation}
          />
          <TextInput
            style={styles.descriptionInput}
            placeholder="Description..."
            placeholderTextColor="#949494"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />

          <Text
            style={{ fontSize: 20, fontWeight: "bold", marginVertical: 20 }}
          >
            Invite Friends
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Search friends"
            placeholderTextColor="#949494"
            value={friend}
            onChangeText={setFriend}
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 17, fontWeight: "bold", marginBottom: 10 }}>
            Event Details
          </Text>
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>Date</Text>
          <View style={{ flexDirection: "row", marginTop: 15 }}>
            <SimpleDropdown
              options={months}
              selectedValue={month}
              onValueChange={setMonth}
            />
            <SimpleDropdown
              options={days}
              selectedValue={day}
              onValueChange={setDay}
            />
            <SimpleDropdown
              options={years}
              selectedValue={year}
              onValueChange={setYear}
            />
          </View>

          <Text style={{ fontSize: 17, fontWeight: "bold" }}>Time</Text>
          <View style={{ flexDirection: "row", marginTop: 15 }}>
            <SimpleDropdown
              options={hours}
              selectedValue={hour}
              onValueChange={setHour}
            />
            <SimpleDropdown
              options={minutes}
              selectedValue={minute}
              onValueChange={setMinute}
            />
            <SimpleDropdown
              options={ampmOptions}
              selectedValue={ampm}
              onValueChange={setAmPm}
            />
          </View>
          <View style={{ alignItems: "center", marginTop: 50 }}>
            <Pressable onPress={createEvent} style={styles.confirmButton}>
              <Text>Confirm Event</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      {showSuccess && (
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <Image
            source={require("../../../assets/EventConfirmed.png")}
            style={styles.overlayImage}
          />
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  confirmButton: {
    width: "50%",
    height: 35,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#C3E3D4",
  },
  topView: {
    height: 120,
    borderBottomLeftRadius: 38,
    padding: 10,
    justifyContent: "flex-end",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  text: {
    fontSize: 18,
    color: "#333",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#C3E3D4",
    height: 50,
    borderRadius: 50,
    marginBottom: 12,
    fontSize: 15,
    paddingHorizontal: 20,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: "#C3E3D4",
    borderRadius: 30,
    marginBottom: 12,
    fontSize: 15,
    paddingHorizontal: 20,
    paddingVertical: 12,
    height: 80,
    textAlignVertical: "top", // ensures text starts at top (Android)
  },
  overlay: {
    position: "absolute",
    top: "40%",
    left: "25%",
    right: "25%",
    alignItems: "center",
  },
  overlayImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
});
