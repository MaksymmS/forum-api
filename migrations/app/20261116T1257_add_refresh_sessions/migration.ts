#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/4014bc513d394ad9bf7324694fae89551d4f5f2956e0818ca88162756b427fa7/contract';
import startContract from '../../snapshots/4014bc513d394ad9bf7324694fae89551d4f5f2956e0818ca88162756b427fa7/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/818eeefcc9d124ba2f0e2746add8583d3deb03e93ab39388c2d3f6822fc87e85/contract';
import endContract from '../../snapshots/818eeefcc9d124ba2f0e2746add8583d3deb03e93ab39388c2d3f6822fc87e85/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropTable({ schema: 'public', table: 'RefreshToken' }),
      this.createTable({
        schema: 'public',
        table: 'RefreshSession',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('expiresIn', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('tokenHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'RefreshSession',
        constraint: 'RefreshSession_tokenHash_key',
        columns: ['tokenHash'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'RefreshSession',
        index: 'RefreshSession_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'RefreshSession',
        foreignKey: {
          name: 'RefreshSession_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
