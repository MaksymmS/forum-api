#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/3ab48514009e049ba436c22ce47290a7eda70c64b1055baf19347d28f510a16f/contract';
import startContract from '../../snapshots/3ab48514009e049ba436c22ce47290a7eda70c64b1055baf19347d28f510a16f/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/9622dfed6af4864b3052a57fc0e4a932bb05f69a0b2a6ca72aae7bf03ec6acc2/contract';
import endContract from '../../snapshots/9622dfed6af4864b3052a57fc0e4a932bb05f69a0b2a6ca72aae7bf03ec6acc2/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'User',
        columns: [
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('hashPassword', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'User',
        constraint: 'User_email_key',
        columns: ['email'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
