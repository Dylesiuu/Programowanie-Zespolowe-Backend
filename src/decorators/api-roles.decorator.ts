import { applyDecorators, SetMetadata } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const ApiRoles = (...roles: string[]) => {
  const decorators = [
    SetMetadata('roles', roles),
    ApiBearerAuth(),
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
  ];

  // Only add ApiForbiddenResponse if roles are provided
  if (roles.length > 0) {
    decorators.push(
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
    );
  }

  return applyDecorators(...decorators);
};
