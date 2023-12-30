import { MigrationInterface, QueryRunner } from 'typeorm';

export class INSERTROWSTRANSACTIONTYPES1703957081806
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO transaction_type (name, createdAt, updatedAt)
        VALUES
          ('pending', NOW(), NOW()),
          ('approved', NOW(), NOW()),
          ('rejected', NOW(), NOW()),
          ('Envío de dinero', NOW(), NOW()),
          ('Pago de servicios', NOW(), NOW()),
          ('Compra de productos', NOW(), NOW()),
          ('Retiro de efectivo', NOW(), NOW()),
          ('Recarga de celular', NOW(), NOW()),
          ('Donaciones', NOW(), NOW());
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM transaction_type
        WHERE name IN ('pending', 'approved', 'rejected', 'Envío de dinero', 'Pago de servicios', 'Compra de productos', 'Retiro de efectivo', 'Recarga de celular', 'Donaciones');
      `);
  }
}
