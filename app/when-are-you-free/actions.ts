"use server";

import { revalidatePath } from "next/cache";
import { saveSubmission } from "@/lib/availability";

export type SubmitAvailabilityState = {
  success: boolean;
  message: string;
};

export async function submitAvailability(
  _prevState: SubmitAvailabilityState,
  formData: FormData,
): Promise<SubmitAvailabilityState> {
  const name = formData.get("name");
  const date = formData.get("date");

  if (typeof name !== "string" || name.trim().length === 0) {
    return { success: false, message: "Please enter your name." };
  }

  if (typeof date !== "string" || date.length === 0) {
    return { success: false, message: "Please choose a date." };
  }

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return { success: false, message: "Please choose a valid date." };
  }

  try {
    await saveSubmission(name, date);
    revalidatePath("/when-are-you-free");

    return {
      success: true,
      message: `Thanks, ${name.trim()}! Your availability has been saved.`,
    };
  } catch {
    return {
      success: false,
      message: "Something went wrong while saving. Please try again.",
    };
  }
}
