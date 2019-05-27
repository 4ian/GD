import { enumerateObjects, filterObjectsList } from './EnumerateObjects';
import { makeTestProject } from '../fixtures/TestProject';
const gd = global.gd;

describe('EnumerateObjects', () => {
  const { project, testLayout } = makeTestProject(gd);

  it('can enumerate objects from a project and scene', () => {
    const {
      containerObjectsList,
      projectObjectsList,
      allObjectsList,
    } = enumerateObjects(project, testLayout);

    expect(containerObjectsList).toHaveLength(12);
    expect(projectObjectsList).toHaveLength(2);
    expect(allObjectsList).toHaveLength(14);
  });

  it('can do a case-insensitive search in the lists of objects', () => {
    const {
      containerObjectsList,
      projectObjectsList,
      allObjectsList,
    } = enumerateObjects(project, testLayout);

    expect(
      filterObjectsList(containerObjectsList, {
        searchText: 'myshapepainterobject',
        selectedTags: [],
      })
    ).toHaveLength(1);
    expect(
      filterObjectsList(projectObjectsList, {
        searchText: 'myshapepainterobject',
        selectedTags: [],
      })
    ).toHaveLength(0);
    expect(
      filterObjectsList(allObjectsList, {
        searchText: 'myshapepainterobject',
        selectedTags: [],
      })
    ).toHaveLength(1);
  });
});
