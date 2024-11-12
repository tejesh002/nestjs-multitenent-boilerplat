import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

export function camelize(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
}

export const alphanumaric = /^[A-Z0-9][A-Z0-9]*$/;

export const tokenGenerator = () => {
  return require('crypto').randomBytes(20).toString('hex');
};

export const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#.])[A-Za-z\d@$!%*?&#.]{8,}$/;

export const comparePassword = async (userPassword, currentPassword) => {
  return await bcrypt.compare(currentPassword, userPassword);
};

export const QUERY_PARAMS = (params: any) => {
  const { limit, page, sort } = params;
  const filter = {};

  Object.keys(params).forEach((item) => {
    if (!['limit', 'page', 'sort'].includes(item)) {
      filter[item] = params[item];
    }
  });

  const sortList = sort.split('-');
  const sorting = {};
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  sortList.length === 2
    ? (sorting[sort.replace('-', '')] = -1)
    : (sorting[sort.replace('-', '')] = 1);

  return {
    skip: (page - 1 || 0) * limit,
    limit: limit,
    sort: sorting,
    page: page,
    filter: filter,
  };
};

export const multerOptionsImage = {
  // Enable file size limits
  limits: {
    fileSize: 100 * 1000 * 1000,
  },
  // Check the mimetypes to allow for upload
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(
        new HttpException(
          `Unsupported file type ${file.originalname}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
};
