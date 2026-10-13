import * as settingService from './setting.service.js';

export async function listSettings(req, res, next) {
  try {
    const settings = await settingService.getAllSettings();
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
}

export async function updateSetting(req, res, next) {
  try {
    const { key } = req.params;
    const { value, description } = req.body;
    const updated = await settingService.setSetting(key, value, description, req.user);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}
