import { SystemSetting } from './setting.model.js';
import { logAuditEvent } from '../audit/audit.service.js';

export async function getSetting(key, defaultValue = null) {
  const setting = await SystemSetting.findOne({ key }).lean();
  if (!setting) return defaultValue;
  return setting.value;
}

export async function getAllSettings() {
  return SystemSetting.find().sort({ key: 1 }).lean();
}

export async function setSetting(key, value, description = '', actor = null) {
  let setting = await SystemSetting.findOne({ key });
  let fromState = null;

  if (setting) {
    fromState = setting.toObject();
    setting.value = value;
    if (description) setting.description = description;
    setting.updatedBy = actor?._id || null;
    await setting.save();
  } else {
    setting = await SystemSetting.create({
      key,
      value,
      description,
      updatedBy: actor?._id || null,
    });
  }

  await logAuditEvent({
    actor,
    action: 'UPDATE_SYSTEM_SETTING',
    targetEntity: 'SystemSetting',
    targetId: setting._id,
    fromState,
    toState: setting.toObject(),
    reason: `Configured setting ${key}`,
  });

  return setting;
}
