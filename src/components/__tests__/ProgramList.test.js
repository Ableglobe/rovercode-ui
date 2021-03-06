import React from 'react';
import { MemoryRouter } from 'react-router';
import { Loader } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import { mountWithIntl, shallowWithIntl } from 'enzyme-react-intl';
import ProgramCollection from '../ProgramCollection';
import ProgramList from '../ProgramList';

let changeReadOnly;
let fetchProgram;
let fetchPrograms;
let removeProgram;
let fetchTags;
let clearProgram;

describe('The ProgramList component', () => {
  beforeEach(() => {
    changeReadOnly = jest.fn();
    fetchProgram = jest.fn(() => Promise.resolve({}));
    fetchPrograms = jest.fn(() => Promise.resolve({}));
    removeProgram = jest.fn(() => Promise.resolve({}));
    fetchTags = jest.fn(() => Promise.resolve({}));
    clearProgram = jest.fn();
  });

  test('renders on the page with no errors', () => {
    const wrapper = shallowWithIntl(
      <ProgramList
        changeReadOnly={changeReadOnly}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        user={{ user_id: 1, username: 'testuser' }}
      />,
    ).dive();
    wrapper.setState({
      focusProgram: {
        id: 1,
        name: 'Test Program',
      },
    });
    expect(wrapper).toMatchSnapshot();
  });

  test('fetches programs on mount', async () => {
    await mountWithIntl(
      <MemoryRouter>
        <ProgramList
          changeReadOnly={changeReadOnly}
          fetchProgram={fetchProgram}
          fetchPrograms={fetchPrograms}
          removeProgram={removeProgram}
          fetchTags={fetchTags}
          clearProgram={clearProgram}
          user={{ user_id: 1, username: 'testuser' }}
        />
      </MemoryRouter>,
    );
    expect(fetchPrograms.mock.calls.length).toBe(2);
    expect(clearProgram.mock.calls.length).toBe(1);
  });

  test('shows the correct number of programs for the user', async () => {
    const programs = {
      next: null,
      previous: null,
      total_pages: 1,
      results: [{
        id: 33,
        name: 'Unnamed_Design_3',
        content: '<xml><variables></variables></xml>',
        user: {
          username: 'admin',
        },
      }, {
        id: 5,
        name: 'Unnamed_Design_2',
        content: '<xml><variables></variables></xml>',
        user: {
          username: 'testuser',
        },
      }],
    };
    const wrapper = shallowWithIntl(
      <ProgramList
        programs={programs}
        changeReadOnly={changeReadOnly}
        userPrograms={programs}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        user={{ user_id: 1, username: 'testuser' }}
      />,
    ).dive();

    expect(wrapper.find(ProgramCollection).exists()).toBe(true);
    expect(wrapper.find(ProgramCollection).length).toBe(3);
    expect(wrapper.find(Loader).exists()).toBe(false);
  });

  test('shows loading when programs fetching', () => {
    const wrapper = shallowWithIntl(
      <ProgramList
        changeReadOnly={changeReadOnly}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        user={{ user_id: 1, username: 'testuser' }}
        programs={null}
      />,
    ).dive();

    expect(wrapper.find(ProgramCollection).exists()).toBe(true);
    expect(wrapper.find(ProgramCollection).length).toBe(2);
    expect(wrapper.find(Loader).exists()).toBe(true);
    expect(wrapper.find(Loader).length).toBe(1);
  });

  test('shows loading when user programs fetching', () => {
    const wrapper = shallowWithIntl(
      <ProgramList
        changeReadOnly={changeReadOnly}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        user={{ user_id: 1, username: 'testuser' }}
        userPrograms={null}
      />,
    ).dive();

    expect(wrapper.find(ProgramCollection).exists()).toBe(true);
    expect(wrapper.find(ProgramCollection).length).toBe(2);
    expect(wrapper.find(Loader).exists()).toBe(true);
    expect(wrapper.find(Loader).length).toBe(1);
  });

  test('shows loading when featured programs fetching', () => {
    const wrapper = shallowWithIntl(
      <ProgramList
        changeReadOnly={changeReadOnly}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        user={{ user_id: 1, username: 'testuser' }}
        featuredPrograms={null}
      />,
    ).dive();

    expect(wrapper.find(ProgramCollection).exists()).toBe(true);
    expect(wrapper.find(ProgramCollection).length).toBe(2);
    expect(wrapper.find(Loader).exists()).toBe(true);
    expect(wrapper.find(Loader).length).toBe(1);
  });

  test('redirects to mission control when program loads', () => {
    const wrapper = shallowWithIntl(
      <ProgramList
        changeReadOnly={changeReadOnly}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        user={{ user_id: 1, username: 'testuser' }}
      />,
    ).dive();

    wrapper.setState({
      programLoaded: true,
    });

    expect(wrapper.find(Redirect).exists()).toBe(true);
    expect(wrapper.find(Redirect).at(0).prop('to')).toEqual({
      pathname: '/mission-control',
    });
  });

  test('loads a program', async () => {
    const programs = {
      next: null,
      previous: null,
      total_pages: 1,
      results: [{
        id: 33,
        name: 'Unnamed_Design_3',
        content: '<xml><variables></variables></xml>',
        user: {
          username: 'admin',
        },
      }],
    };
    const wrapper = shallowWithIntl(
      <ProgramList
        changeReadOnly={changeReadOnly}
        programs={programs}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        user={{ user_id: 1, username: 'testuser' }}
      />,
    ).dive();

    await wrapper.instance().loadProgram({
      target: {
        parentNode: {
          id: undefined,
        },
        id: 33,
        dataset: {
          owned: 'false',
        },
      },
    });

    expect(changeReadOnly).toHaveBeenCalledWith(true);
    expect(fetchProgram).toHaveBeenCalledWith(33);
    expect(wrapper.state('programLoaded')).toBe(true);

    wrapper.setState({
      programLoaded: false,
    });

    await wrapper.instance().loadProgram({
      target: {
        parentNode: {
          id: 55,
          dataset: {
            owned: 'true',
          },
        },
      },
    });

    expect(changeReadOnly).toHaveBeenCalledWith(false);
    expect(fetchProgram).toHaveBeenCalledWith(33);
    expect(wrapper.state('programLoaded')).toBe(true);
  });

  test('fetches user programs after page change', async () => {
    const programs = {
      next: null,
      previous: null,
      total_pages: 1,
      results: [{
        id: 33,
        name: 'Unnamed_Design_3',
        content: '<xml><variables></variables></xml>',
        user: {
          username: 'admin',
        },
      }],
    };
    const wrapper = shallowWithIntl(
      <ProgramList
        programs={programs}
        changeReadOnly={changeReadOnly}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        user={{ user_id: 1, username: 'testuser' }}
      />,
    ).dive();

    await wrapper.instance().fetchUserPrograms({
      page: 2,
    }, true);

    expect(fetchPrograms).toHaveBeenCalledWith({
      user: 1,
      page: 2,
    });
  });

  test('fetches featured programs after page change', async () => {
    const programs = {
      next: null,
      previous: null,
      total_pages: 1,
      results: [{
        id: 33,
        name: 'Unnamed_Design_3',
        content: '<xml><variables></variables></xml>',
        user: {
          username: 'admin',
        },
      }],
    };
    const wrapper = shallowWithIntl(
      <ProgramList
        programs={programs}
        changeReadOnly={changeReadOnly}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        user={{ user_id: 1, username: 'testuser' }}
      />,
    ).dive();

    await wrapper.instance().fetchFeaturedPrograms({
      page: 2,
    }, false);

    expect(fetchPrograms).toHaveBeenCalledWith({
      admin_tags: 'featured',
      page: 2,
    });
  });

  test('fetches other programs after page change', async () => {
    const programs = {
      next: null,
      previous: null,
      total_pages: 1,
      results: [{
        id: 33,
        name: 'Unnamed_Design_3',
        content: '<xml><variables></variables></xml>',
        user: {
          username: 'admin',
        },
      }],
    };
    const wrapper = shallowWithIntl(
      <ProgramList
        programs={programs}
        changeReadOnly={changeReadOnly}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        user={{ user_id: 1, username: 'testuser' }}
      />,
    ).dive();

    await wrapper.instance().fetchOtherPrograms({
      page: 2,
    }, false);

    expect(fetchPrograms).toHaveBeenCalledWith({
      user__not: 1,
      page: 2,
    });
  });

  test('fetches programs after search change', () => {
    const programs = {
      next: null,
      previous: null,
      total_pages: 1,
      results: [{
        id: 33,
        name: 'Unnamed_Design_3',
        content: '<xml><variables></variables></xml>',
        user: {
          username: 'admin',
        },
      }],
    };
    const wrapper = shallowWithIntl(
      <ProgramList
        programs={programs}
        changeReadOnly={changeReadOnly}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        user={{ user_id: 1, username: 'testuser' }}
      />,
    ).dive();

    wrapper.instance().fetchUserPrograms({
      search: 'abc',
      page: 1,
    }, true);

    expect(fetchPrograms).toHaveBeenCalledWith({
      user: 1,
      page: 1,
      search: 'abc',
    });
  });

  test('fetches featured programs after search change', () => {
    const programs = {
      next: null,
      previous: null,
      total_pages: 1,
      results: [{
        id: 33,
        name: 'Unnamed_Design_3',
        content: '<xml><variables></variables></xml>',
        user: {
          username: 'admin',
        },
      }],
    };
    const wrapper = shallowWithIntl(
      <ProgramList
        programs={programs}
        changeReadOnly={changeReadOnly}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        user={{ user_id: 1, username: 'testuser' }}
      />,
    ).dive();

    wrapper.instance().fetchFeaturedPrograms({
      search: 'abc',
      page: 1,
    }, false);

    expect(fetchPrograms).toHaveBeenCalledWith({
      admin_tags: 'featured',
      page: 1,
      search: 'abc',
    });
  });


  test('fetches other programs after search change', () => {
    const programs = {
      next: null,
      previous: null,
      total_pages: 1,
      results: [{
        id: 33,
        name: 'Unnamed_Design_3',
        content: '<xml><variables></variables></xml>',
        user: {
          username: 'admin',
        },
      }],
    };
    const wrapper = shallowWithIntl(
      <ProgramList
        programs={programs}
        changeReadOnly={changeReadOnly}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        user={{ user_id: 1, username: 'testuser' }}
      />,
    ).dive();

    wrapper.instance().fetchOtherPrograms({
      search: 'abc',
      page: 1,
    }, false);

    expect(fetchPrograms).toHaveBeenCalledWith({
      user__not: 1,
      page: 1,
      search: 'abc',
    });
  });

  test('removes a program and reloads the program list', async () => {
    const programs = {
      next: null,
      previous: null,
      total_pages: 1,
      results: [{
        id: 33,
        name: 'Unnamed_Design_3',
        content: '<xml><variables></variables></xml>',
        user: {
          username: 'admin',
        },
      }],
    };
    const wrapper = shallowWithIntl(
      <ProgramList
        programs={programs}
        changeReadOnly={changeReadOnly}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        user={{ user_id: 1, username: 'testuser' }}
      />,
    ).dive();

    wrapper.setState({
      focusProgram: {
        id: 33,
        name: 'Unnamed_Design_3',
      },
    });
    await wrapper.instance().removeProgram();

    expect(fetchPrograms).toHaveBeenCalledTimes(6);
    expect(removeProgram).toHaveBeenCalledWith(33);
  });

  test('shows confirm dialog', () => {
    const wrapper = shallowWithIntl(
      <ProgramList
        changeReadOnly={changeReadOnly}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        user={{ user_id: 1, username: 'testuser' }}
      />,
    ).dive();

    wrapper.instance().showConfirm({
      target: {
        parentNode: {
          id: undefined,
        },
        id: 33,
        name: 'Unnamed_Design_3',
      },
    });

    expect(wrapper.state('confirmOpen')).toBe(true);
  });

  test('cancel dialog does not remove program', () => {
    const wrapper = shallowWithIntl(
      <ProgramList
        changeReadOnly={changeReadOnly}
        fetchProgram={fetchProgram}
        fetchPrograms={fetchPrograms}
        removeProgram={removeProgram}
        fetchTags={fetchTags}
        clearProgram={clearProgram}
        user={{ user_id: 1, username: 'testuser' }}
      />,
    ).dive();

    wrapper.instance().cancelRemove();

    expect(fetchPrograms).toHaveBeenCalledTimes(1);
    expect(removeProgram).not.toHaveBeenCalled();
    expect(wrapper.state('confirmOpen')).toBe(false);
  });
});
