import { applyDecorators, SetMetadata } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const ApiRoles = (...roles: string[]) => {
  return applyDecorators(
    SetMetadata('roles', roles),
    ApiBearerAuth(),
    ApiForbiddenResponse({
      description: `Required roles: **${roles}** or higher`,
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Lack of required roles' },
          error: { type: 'string', example: 'Forbidden' },
          statusCode: { type: 'number', example: 403 },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'User is not authorized.',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Invalid token' },
          error: { type: 'string', example: 'Unauthorized' },
          statusCode: { type: 'number', example: 401 },
        },
      },
    }),
  );
};
