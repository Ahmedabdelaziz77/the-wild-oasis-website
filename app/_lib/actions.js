"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";
export async function updateProfile(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in ");
  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");
  if (!/^[a-zA-Z0-9]{6,14}$/.test(nationalID)) {
    throw new Error("please provide a valid nationalID");
  }

  const updateData = { nationality, countryFlag, nationalID };
  const { error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) throw new Error("Guest could not be updated");

  revalidatePath("/account/profile");
}

export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in ");
  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 500),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };
  const { error } = await supabase.from("bookings").insert([newBooking]);
  if (error) throw new Error("Booking could not be created");
  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect("/cabins/thankyou");
}
export async function deleteBooking(bookingId) {
  // authentication for next
  const session = await auth();
  if (!session) throw new Error("You must be logged in ");
  // authorization for next
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);
  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not authorized to delete this booking");
  // delete the booking
  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);
  // handle error
  if (error) throw new Error("Booking could not be deleted");
  // revalidate the data in reservations
  revalidatePath("/account/reservations");
}
export async function updateBooking(formData) {
  const bookingId = Number(formData.get("bookingId"));
  // auth
  const session = await auth();
  if (!session) throw new Error("You must be logged in ");
  // authorization
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);
  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not authorized to delete this booking");
  // update the booking
  const updateData = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 500),
  };
  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId);
  // handle errors
  if (error) throw new Error("Booking could not be updated");

  // revalidate the data in reservations
  revalidatePath("/account/reservations");
  revalidatePath(`/account/reservations/edit/${bookingId}`);

  // redirect to the reservations page
  redirect("/account/reservations");
}
export async function singInAction() {
  await signIn("google", { redirectTo: "/account" });
}
export async function signOutAction() {
  await signOut({ redirectTo: "/login" });
}
