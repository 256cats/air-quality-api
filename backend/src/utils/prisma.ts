import { PrismaClient } from '@prisma/client';
import { Token } from 'typedi';

export const PRISMA_CLIENT_TOKEN = new Token<PrismaClient>('PRISMA_CLIENT');
