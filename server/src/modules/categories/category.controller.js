import * as categoryService from './category.service.js';

export async function listCategories(req, res, next) {
  try {
    const includeInactive = req.user && ['admin', 'super_admin'].includes(req.user.role);
    const categories = await categoryService.getAllCategories(includeInactive);
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
}

export async function getCategory(req, res, next) {
  try {
    const category = await categoryService.getCategoryByCode(req.params.code);
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
}

export async function createCategory(req, res, next) {
  try {
    const category = await categoryService.createCategory(req.body, req.user);
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body, req.user);
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
}
