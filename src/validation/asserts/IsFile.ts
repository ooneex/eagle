import type { MimeType } from '@/http/types.ts';
import { RequestFile } from '@/request/RequestFile.ts';
import {
  type ValidationArguments,
  type ValidationOptions,
  registerDecorator,
} from 'class-validator';

interface IsFileOptions {
  mimeTypes?: MimeType[];
  maxSize?: number;
  minSize?: number;
  extensions?: string[];
  isImage?: boolean;
  isSvg?: boolean;
  isVideo?: boolean;
  isAudio?: boolean;
  isPdf?: boolean;
  isText?: boolean;
  isExcel?: boolean;
  isCsv?: boolean;
  isJson?: boolean;
  isXml?: boolean;
  isHtml?: boolean;
}

export const IsFile =
  (options?: IsFileOptions, validationOptions?: ValidationOptions) =>
  // biome-ignore lint/complexity/noBannedTypes: trust me
  (object: Object, propertyName: string) =>
    registerDecorator({
      name: 'isFile',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (!(value instanceof RequestFile)) {
            return false;
          }

          if (options?.mimeTypes && !options.mimeTypes.includes(value.type)) {
            return false;
          }

          if (options?.maxSize && value.size > options.maxSize) {
            return false;
          }

          if (options?.minSize && value.size < options.minSize) {
            return false;
          }

          if (
            options?.extensions &&
            !options.extensions.includes(value.extension)
          ) {
            return false;
          }

          if (options?.isImage && !value.isImage) {
            return false;
          }

          if (options?.isSvg && !value.isSvg) {
            return false;
          }

          if (options?.isVideo && !value.isVideo) {
            return false;
          }

          if (options?.isAudio && !value.isAudio) {
            return false;
          }

          if (options?.isPdf && !value.isPdf) {
            return false;
          }

          if (options?.isText && !value.isText) {
            return false;
          }

          if (options?.isExcel && !value.isExcel) {
            return false;
          }

          if (options?.isCsv && !value.isCsv) {
            return false;
          }

          if (options?.isJson && !value.isJson) {
            return false;
          }

          if (options?.isXml && !value.isXml) {
            return false;
          }

          if (options?.isHtml && !value.isHtml) {
            return false;
          }

          return true;
        },
      },
    });
