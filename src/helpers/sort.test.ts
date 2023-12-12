import { sortPilets } from './sort';

describe('Sort Pilets', () => {
  it('works against empty data', () => {
    const names = sortPilets([]).map((m) => m.name);
    expect(names).toEqual([]);
  });

  it('works against just names', () => {
    const names = sortPilets([
      { name: 'foo' } as any,
      { name: 'bar' } as any,
      { name: 'a' } as any,
      { name: 'z' } as any,
    ]).map((m) => m.name);
    expect(names).toEqual(['a', 'bar', 'foo', 'z']);
  });

  it('works against just ordered names', () => {
    const names = sortPilets([{ name: 'zlB' } as any, { name: 'zlD' } as any, { name: 'zlA' } as any]).map(
      (m) => m.name,
    );
    expect(names).toEqual(['zlA', 'zlB', 'zlD']);
  });

  it('works against ordered names', () => {
    const names = sortPilets([
      { name: 'zlB' } as any,
      { name: 'zlF' } as any,
      { name: 'zlG' } as any,
      { name: 'zlD' } as any,
      { name: 'zlE' } as any,
      { name: 'zlA' } as any,
    ]).map((m) => m.name);
    expect(names).toEqual(['zlA', 'zlB', 'zlD', 'zlE', 'zlF', 'zlG']);
  });
});
