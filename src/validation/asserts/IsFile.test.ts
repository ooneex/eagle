import { describe, expect, it } from 'bun:test';
import { RequestFile } from '@/request';
import { IsFile, validate } from '@/validation';

describe('IsFile', () => {
  it('should validate basic file', async () => {
    class TestClass {
      @IsFile()
      file: RequestFile;
    }

    const test = new TestClass();
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    test.file = new RequestFile(file);

    const result = await validate(test);
    expect(result).toHaveLength(0);

    // @ts-ignore: test
    test.file = 'test';

    const result2 = await validate(test);
    expect(result2).toHaveLength(1);
  });

  it('should validate file with mimeTypes options', async () => {
    class TestClass {
      @IsFile({ mimeTypes: ['text/plain'] })
      file: RequestFile;
    }

    const test = new TestClass();
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    test.file = new RequestFile(file);

    const result = await validate(test);
    expect(result).toHaveLength(0);

    test.file = new RequestFile(
      new File(['test'], 'test.txt', { type: 'image/png' }),
    );
    const result2 = await validate(test);
    expect(result2).toHaveLength(1);
  });

  it('should validate file with size options', async () => {
    class TestClass {
      @IsFile({ maxSize: 10, minSize: 2 })
      file: RequestFile;
    }

    const test = new TestClass();
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    test.file = new RequestFile(file);

    const result = await validate(test);
    expect(result).toHaveLength(0);

    test.file = new RequestFile(
      new File(['t'], 'test.txt', { type: 'text/plain' }),
    );
    const result2 = await validate(test);
    expect(result2).toHaveLength(1);

    test.file = new RequestFile(
      new File(['test'.repeat(10)], 'test.txt', { type: 'text/plain' }),
    );
    const result3 = await validate(test);
    expect(result3).toHaveLength(1);
  });

  it('should validate file with extension options', async () => {
    class TestClass {
      @IsFile({ extensions: ['txt', 'md'] })
      file: RequestFile;
    }

    const test = new TestClass();
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    test.file = new RequestFile(file);

    const result = await validate(test);
    expect(result).toHaveLength(0);

    test.file = new RequestFile(
      new File(['test'], 'test.pdf', { type: 'application/pdf' }),
    );
    const result2 = await validate(test);
    expect(result2).toHaveLength(1);
  });

  it('should validate file with type flag options', async () => {
    class TestClass {
      @IsFile({ isImage: true })
      imageFile: RequestFile;

      @IsFile({ isPdf: true })
      pdfFile: RequestFile;

      @IsFile({ isJson: true })
      jsonFile: RequestFile;
    }

    const test = new TestClass();

    test.imageFile = new RequestFile(
      new File(['test'], 'test.png', { type: 'image/png' }),
    );
    test.pdfFile = new RequestFile(
      new File(['test'], 'test.pdf', { type: 'application/pdf' }),
    );
    test.jsonFile = new RequestFile(
      new File(['{}'], 'test.json', { type: 'application/json' }),
    );

    const result = await validate(test);
    expect(result).toHaveLength(0);

    test.imageFile = new RequestFile(
      new File(['test'], 'test.txt', { type: 'text/plain' }),
    );
    const result2 = await validate(test);
    expect(result2).toHaveLength(1);

    test.pdfFile = new RequestFile(
      new File(['test'], 'test.txt', { type: 'text/plain' }),
    );
    const result3 = await validate(test);
    expect(result3).toHaveLength(2);

    test.jsonFile = new RequestFile(
      new File(['test'], 'test.txt', { type: 'text/plain' }),
    );
    const result4 = await validate(test);
    expect(result4).toHaveLength(3);
  });

  it('should validate file with type flag options', async () => {
    class TestClass {
      @IsFile({ isImage: true })
      imageFile: RequestFile;
    }

    const test = new TestClass();
    test.imageFile = new RequestFile(
      new File(['test'], 'test.png', { type: 'image/png' }),
    );

    const result = await validate(test);
    expect(result).toHaveLength(0);

    test.imageFile = new RequestFile(
      new File(['test'], 'test.txt', { type: 'text/plain' }),
    );
    const result2 = await validate(test);
    expect(result2).toHaveLength(1);
  });

  it('should validate file with isSvg flag option', async () => {
    class TestClass {
      @IsFile({ isSvg: true })
      svgFile: RequestFile;
    }

    const test = new TestClass();
    test.svgFile = new RequestFile(
      new File(['<svg></svg>'], 'test.svg', { type: 'image/svg+xml' }),
    );

    const result = await validate(test);
    expect(result).toHaveLength(0);

    test.svgFile = new RequestFile(
      new File(['test'], 'test.txt', { type: 'text/plain' }),
    );
    const result2 = await validate(test);
    expect(result2).toHaveLength(1);
  });

  it('should validate file with isVideo flag option', async () => {
    class TestClass {
      @IsFile({ isVideo: true })
      videoFile: RequestFile;
    }

    const test = new TestClass();
    test.videoFile = new RequestFile(
      new File(['test'], 'test.mp4', { type: 'video/mp4' }),
    );

    const result = await validate(test);
    expect(result).toHaveLength(0);

    test.videoFile = new RequestFile(
      new File(['test'], 'test.txt', { type: 'text/plain' }),
    );
    const result2 = await validate(test);
    expect(result2).toHaveLength(1);
  });

  it('should validate file with isAudio flag option', async () => {
    class TestClass {
      @IsFile({ isAudio: true })
      audioFile: RequestFile;
    }

    const test = new TestClass();
    test.audioFile = new RequestFile(
      new File(['test'], 'test.mp3', { type: 'audio/mpeg' }),
    );

    const result = await validate(test);
    expect(result).toHaveLength(0);

    test.audioFile = new RequestFile(
      new File(['test'], 'test.txt', { type: 'text/plain' }),
    );
    const result2 = await validate(test);
    expect(result2).toHaveLength(1);
  });

  it('should validate file with isText flag option', async () => {
    class TestClass {
      @IsFile({ isText: true })
      textFile: RequestFile;
    }

    const test = new TestClass();
    test.textFile = new RequestFile(
      new File(['test'], 'test.txt', { type: 'text/plain' }),
    );

    const result = await validate(test);
    expect(result).toHaveLength(0);

    test.textFile = new RequestFile(
      new File(['test'], 'test.png', { type: 'image/png' }),
    );
    const result2 = await validate(test);
    expect(result2).toHaveLength(1);
  });

  it('should validate file with isExcel flag option', async () => {
    class TestClass {
      @IsFile({ isExcel: true })
      excelFile: RequestFile;
    }

    const test = new TestClass();
    test.excelFile = new RequestFile(
      new File(['test'], 'test.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
    );

    const result = await validate(test);
    expect(result).toHaveLength(0);

    test.excelFile = new RequestFile(
      new File(['test'], 'test.txt', { type: 'text/plain' }),
    );
    const result2 = await validate(test);
    expect(result2).toHaveLength(1);
  });

  it('should validate file with isCsv flag option', async () => {
    class TestClass {
      @IsFile({ isCsv: true })
      csvFile: RequestFile;
    }

    const test = new TestClass();
    test.csvFile = new RequestFile(
      new File(['test'], 'test.csv', { type: 'text/csv' }),
    );

    const result = await validate(test);
    expect(result).toHaveLength(0);

    test.csvFile = new RequestFile(
      new File(['test'], 'test.txt', { type: 'text/plain' }),
    );
    const result2 = await validate(test);
    expect(result2).toHaveLength(1);
  });

  it('should validate file with isXml flag option', async () => {
    class TestClass {
      @IsFile({ isXml: true })
      xmlFile: RequestFile;
    }

    const test = new TestClass();
    test.xmlFile = new RequestFile(
      new File(['<xml></xml>'], 'test.xml', { type: 'application/xml' }),
    );

    const result = await validate(test);
    expect(result).toHaveLength(0);

    test.xmlFile = new RequestFile(
      new File(['test'], 'test.txt', { type: 'text/plain' }),
    );
    const result2 = await validate(test);
    expect(result2).toHaveLength(1);
  });

  it('should validate file with isHtml flag option', async () => {
    class TestClass {
      @IsFile({ isHtml: true })
      htmlFile: RequestFile;
    }

    const test = new TestClass();
    test.htmlFile = new RequestFile(
      new File(['<html></html>'], 'test.html', { type: 'text/html' }),
    );

    const result = await validate(test);
    expect(result).toHaveLength(0);

    test.htmlFile = new RequestFile(
      new File(['test'], 'test.txt', { type: 'text/plain' }),
    );
    const result2 = await validate(test);
    expect(result2).toHaveLength(1);
  });
});
