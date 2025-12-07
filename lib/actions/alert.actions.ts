'use server';

import { connectToDatabase } from '@/db/mongoose';
import { Alert } from '@/db/models/alert.model';

type UpsertAlert = {
  symbol: string;
  company: string;
  alertName: string;
  alertType: 'upper' | 'lower';
  threshold: number;
};

export async function getAlerts(userId: string) {
  await connectToDatabase();
  const docs = await Alert.find({ userId }).sort({ createdAt: -1 }).lean();
  return docs.map((d) => ({
    id: String(d._id),
    userId: d.userId,
    symbol: d.symbol,
    company: d.company,
    alertName: d.alertName,
    alertType: d.alertType,
    threshold: d.threshold,
    createdAt: d.createdAt instanceof Date ? d.createdAt.toISOString() : String(d.createdAt),
  }));
}

export async function createAlert(userId: string, input: UpsertAlert) {
  await connectToDatabase();
  const threshold = Number(input.threshold);
  if (!Number.isFinite(threshold)) {
    return { success: false, message: 'Threshold must be a number' };
  }

  const payload = {
    userId,
    symbol: input.symbol.toUpperCase().trim(),
    company: input.company.trim(),
    alertName: input.alertName.trim(),
    alertType: input.alertType,
    threshold,
  } satisfies UpsertAlert;

  const doc = await Alert.create(payload);
  return { success: true, data: { ...doc.toObject(), id: String(doc._id) } };
}

export async function updateAlert(userId: string, id: string, updates: Partial<UpsertAlert>) {
  await connectToDatabase();
  const $set: Record<string, string | number> = {};
  if (updates.symbol) $set.symbol = updates.symbol.toUpperCase().trim();
  if (updates.company) $set.company = updates.company.trim();
  if (updates.alertName) $set.alertName = updates.alertName.trim();
  if (updates.alertType) $set.alertType = updates.alertType;
  if (updates.threshold !== undefined) {
    const thr = Number(updates.threshold);
    if (!Number.isFinite(thr)) return { success: false, message: 'Threshold must be a number' };
    $set.threshold = thr;
  }

  const res = await Alert.updateOne({ _id: id, userId }, { $set });
  if (res.matchedCount === 0) return { success: false, message: 'Alert not found' };
  return { success: true };
}

export async function deleteAlert(userId: string, id: string) {
  await connectToDatabase();
  await Alert.deleteOne({ _id: id, userId });
  return { success: true };
}
