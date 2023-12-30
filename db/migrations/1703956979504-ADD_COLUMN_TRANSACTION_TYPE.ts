import { MigrationInterface, QueryRunner } from "typeorm";

export class ADDCOLUMNTRANSACTIONTYPE1703956979504 implements MigrationInterface {
    name = 'ADDCOLUMNTRANSACTIONTYPE1703956979504'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transaction_type\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`transaction_type\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transaction_type\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`transaction_type\` DROP COLUMN \`createdAt\``);
    }

}
