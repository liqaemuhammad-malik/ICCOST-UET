import { ParticipantCategory } from './category.model.js';
import { AppError } from '../../utils/appError.js';
import { logAuditEvent } from '../audit/audit.service.js';

export async function getAllCategories(includeInactive = false) {
  const query = includeInactive ? {} : { isActive: true };
  return ParticipantCategory.find(query).sort({ code: 1 }).lean();
}

export async function getCategoryByCode(code) {
  const category = await ParticipantCategory.findOne({ code: code.toUpperCase() }).lean();
  if (!category) {
    throw AppError.notFound(`Participant category '${code}' not found`);
  }
  return category;
}

export async function createCategory(data, actor = null) {
  const existing = await ParticipantCategory.findOne({ code: data.code.toUpperCase() });
  if (existing) {
    throw AppError.conflict(`Category code '${data.code}' already exists`);
  }

  const category = await ParticipantCategory.create({
    ...data,
    code: data.code.toUpperCase(),
  });

  await logAuditEvent({
    actor,
    action: 'CREATE_PARTICIPANT_CATEGORY',
    targetEntity: 'ParticipantCategory',
    targetId: category._id,
    toState: category.toObject(),
    reason: 'Admin created participant category',
  });

  return category;
}

export async function updateCategory(id, data, actor = null) {
  const category = await ParticipantCategory.findById(id);
  if (!category) {
    throw AppError.notFound('Participant category not found');
  }

  const fromState = category.toObject();
  Object.assign(category, data);
  if (data.code) category.code = data.code.toUpperCase();
  await category.save();

  await logAuditEvent({
    actor,
    action: 'UPDATE_PARTICIPANT_CATEGORY',
    targetEntity: 'ParticipantCategory',
    targetId: category._id,
    fromState,
    toState: category.toObject(),
    reason: 'Admin updated participant category',
  });

  return category;
}
