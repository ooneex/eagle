import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { Doc, DocContainer } from './mod.ts';

describe('DocContainer', () => {
  it('should store and retrieve docs', () => {
    // Create a sample doc
    const doc = new Doc('test-content');
    const docId = 'test-id';
    DocContainer.add(docId, doc);
    const retrieved = DocContainer.get(docId);
    expect(retrieved).toBeDefined();
    expect(retrieved).toBe(doc);
  });

  it('should delete docs', () => {
    const docId = 'test-id';
    DocContainer.delete(docId);
    const retrieved = DocContainer.get(docId);
    expect(retrieved).toBeUndefined();
  });

  it('should clear all docs', () => {
    DocContainer.add('id1', new Doc('content1'));
    DocContainer.add('id2', new Doc('content2'));
    DocContainer.clear();

    expect(DocContainer.count()).toBe(0);
  });
});
