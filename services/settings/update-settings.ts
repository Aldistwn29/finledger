import {
  updateCurrentUserSettings,
  type UpdateSettingsInput,
} from "@/db/rpc/settings";

export async function updateSettings(
  input: UpdateSettingsInput,
): Promise<void> {
  await updateCurrentUserSettings(input);
}
