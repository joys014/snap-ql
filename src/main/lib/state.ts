import { homedir } from 'os'
import fs from 'fs-extra'

import { z } from 'zod'

const settingsSchema = z.object({
  connectionString: z.string().optional(),
  openAiKey: z.string().optional(),
  openAiBaseUrl: z.string().optional(),
  openAiModel: z.string().optional()
})

const defaultSettings: z.infer<typeof settingsSchema> = {
  connectionString: undefined,
  openAiKey: undefined,
  openAiBaseUrl: undefined,
  openAiModel: undefined
}

function rootDir() {
  return `${homedir()}/SnapQL`
}

async function settingsPath() {
  const root = rootDir()
  await fs.ensureDir(root)
  return `${root}/settings.json`
}

async function getSettings() {
  const path = await settingsPath()
  let settings
  try {
    settings = await fs.readJson(path)
    settings = settingsSchema.parse(settings)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(error.message)
    }
    settings = defaultSettings
    await fs.writeJson(path, settings)
  }
  return settings
}

async function setSettings(settings: z.infer<typeof settingsSchema>) {
  const path = await settingsPath()
  await fs.writeJson(path, settings)
}

export async function getConnectionString() {
  const settings = await getSettings()
  return settings.connectionString
}

export async function getOpenAiKey() {
  const settings = await getSettings()
  return settings.openAiKey
}

export async function getOpenAiBaseUrl() {
  const settings = await getSettings()
  return settings.openAiBaseUrl
}

export async function getOpenAiModel() {
  const settings = await getSettings()
  return settings.openAiModel
}

export async function setConnectionString(connectionString: string) {
  const settings = await getSettings()
  settings.connectionString = connectionString
  await setSettings(settings)
}

export async function setOpenAiKey(openAiKey: string) {
  const settings = await getSettings()
  settings.openAiKey = openAiKey
  await setSettings(settings)
}

export async function setOpenAiBaseUrl(openAiBaseUrl: string) {
  const settings = await getSettings()
  settings.openAiBaseUrl = openAiBaseUrl
  await setSettings(settings)
}

export async function setOpenAiModel(openAiModel: string) {
  const settings = await getSettings()
  settings.openAiModel = openAiModel
  await setSettings(settings)
}
