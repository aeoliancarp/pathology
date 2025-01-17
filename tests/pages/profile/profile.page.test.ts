import { ObjectId } from 'bson';
import { GetServerSidePropsContext } from 'next';
import { Logger } from 'winston';
import GraphType from '../../../constants/graphType';
import TestId from '../../../constants/testId';
import { getReviewsByUserId, getReviewsByUserIdCount } from '../../../helpers/getReviewsByUserId';
import { getReviewsForUserId, getReviewsForUserIdCount } from '../../../helpers/getReviewsForUserId';
import { logger } from '../../../helpers/logger';
import { createNewReviewOnYourLevelNotification } from '../../../helpers/notificationHelper';
import dbConnect, { dbDisconnect } from '../../../lib/dbConnect';
import { getTokenCookieValue } from '../../../lib/getTokenCookie';
import { GraphModel } from '../../../models/mongoose';
import * as search from '../../../pages/api/search';
import { getServerSideProps, ProfileTab } from '../../../pages/profile/[name]/[[...tab]]/index';

beforeAll(async () => {
  await dbConnect();

  for (let i = 0; i < 30; i++) {
    await createNewReviewOnYourLevelNotification(TestId.USER, TestId.USER_B, new ObjectId(), 'id ' + i);
  }
});
afterAll(async () => {
  await dbDisconnect();
});

describe('pages/profile page', () => {
  test('getServerSideProps with no parameters', async () => {
    const context = {
    };

    const ret = await getServerSideProps(context as GetServerSidePropsContext);

    expect(ret.notFound).toBe(true);
  });
  test('getServerSideProps with params parameters but no values', async () => {
    const context = {
      params: {

      }
    };

    const ret = await getServerSideProps(context as GetServerSidePropsContext);

    expect(ret.notFound).toBe(true);
  });
  test('getServerSideProps with params parameters multiple folder structure should 404', async () => {
    const context = {
      params: {
        name: 'test',
        tab: ['reviews-written', 'reviews', 'reviews']
      }
    };

    const ret = await getServerSideProps(context as unknown as GetServerSidePropsContext);

    expect(ret.notFound).toBe(true);
  });
  test('getServerSideProps with name params parameters', async () => {
    const context = {
      params: {
        name: 'test',
      }
    };

    const ret = await getServerSideProps(context as unknown as GetServerSidePropsContext);

    expect(ret.props).toBeDefined();
    expect(ret.props?.pageProp).toBe(1);
    expect(ret.props?.reviewsReceived).toHaveLength(0);
    expect(ret.props?.reviewsWritten).toHaveLength(0);
    expect(ret.props?.profileTab).toBe('');
    expect(ret.props?.reviewsReceivedCount).toBe(1);
    expect(ret.props?.reviewsWrittenCount).toBe(1);
    expect(ret.props?.user._id).toBe(TestId.USER);
    expect(ret.props?.followerCountInit).toBe(0);
    expect(ret.props?.reqUserIsFollowing).toBeNull();
  });
  test('getServerSideProps collections tab', async () => {
    const context = {
      params: {
        name: 'test',
        tab: [ProfileTab.Collections],
      },
      req: {
        cookies: {
          token: getTokenCookieValue(TestId.USER),
        },
      },
    };

    const ret = await getServerSideProps(context as unknown as GetServerSidePropsContext);

    expect(ret.props).toBeDefined();
    expect(ret.props?.pageProp).toBe(1);
    expect(ret.props?.reviewsReceived).toHaveLength(0);
    expect(ret.props?.reviewsWritten).toHaveLength(0);
    expect(ret.props?.profileTab).toBe('collections');
    expect(ret.props?.reviewsReceivedCount).toBe(1);
    expect(ret.props?.reviewsWrittenCount).toBe(1);
    expect(ret.props?.user._id).toBe(TestId.USER);
  });
  test('getServerSideProps levels tab', async () => {
    const context = {
      params: {
        name: 'test',
        tab: [ProfileTab.Levels],
      },
      query: {
        page: '2',
      },
      req: {
        cookies: {
          token: getTokenCookieValue(TestId.USER),
        },
      },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const ret = await getServerSideProps(context as unknown as GetServerSidePropsContext);

    expect(ret.props).toBeDefined();
    expect(ret.props?.pageProp).toBe(2);
    expect(ret.props?.reviewsReceived).toHaveLength(0);
    expect(ret.props?.reviewsWritten).toHaveLength(0);
    expect(ret.props?.profileTab).toBe('levels');
    expect(ret.props?.reviewsReceivedCount).toBe(1);
    expect(ret.props?.reviewsWrittenCount).toBe(1);
    expect(ret.props?.user._id).toBe(TestId.USER);
  });
  test('getServerSideProps reviews-received tab', async () => {
    const context = {
      params: {
        name: 'test',
        tab: [ProfileTab.ReviewsReceived],
      }
    };

    const ret = await getServerSideProps(context as unknown as GetServerSidePropsContext);

    expect(ret.props).toBeDefined();
    expect(ret.props?.pageProp).toBe(1);
    expect(ret.props?.reviewsReceived).toHaveLength(1);
    expect(ret.props?.reviewsWritten).toHaveLength(0);
    expect(ret.props?.profileTab).toBe('reviews-received');
    expect(ret.props?.reviewsReceivedCount).toBe(1);
    expect(ret.props?.reviewsWrittenCount).toBe(1);
    expect(ret.props?.user._id).toBe(TestId.USER);
  });
  test('getServerSideProps reviews-written tab', async () => {
    const context = {
      params: {
        name: 'test',
        tab: [ProfileTab.ReviewsWritten],
      }
    };

    const ret = await getServerSideProps(context as unknown as GetServerSidePropsContext);

    expect(ret.props).toBeDefined();
    expect(ret.props?.pageProp).toBe(1);
    expect(ret.props?.reviewsReceived).toHaveLength(0);
    expect(ret.props?.reviewsWritten).toHaveLength(1);
    expect(ret.props?.profileTab).toBe('reviews-written');
    expect(ret.props?.reviewsReceivedCount).toBe(1);
    expect(ret.props?.reviewsWrittenCount).toBe(1);
    expect(ret.props?.user._id).toBe(TestId.USER);
  });
  test('getServerSideProps after following 2 users', async () => {
    const context = {
      params: {
        name: 'test',
      },
      req: {
        cookies: {
          token: getTokenCookieValue(TestId.USER)
        }
      },
    };

    await GraphModel.create({
      source: TestId.USER,
      sourceModel: 'User',
      type: GraphType.FOLLOW,
      target: TestId.USER_B,
      targetModel: 'User',
    });

    await GraphModel.create({
      source: TestId.USER,
      sourceModel: 'User',
      type: GraphType.FOLLOW,
      target: TestId.USER_C,
      targetModel: 'User',
    });

    const ret = await getServerSideProps(context as unknown as GetServerSidePropsContext);

    expect(ret.props).toBeDefined();
    expect(ret.props?.pageProp).toBe(1);
    expect(ret.props?.reviewsReceived).toHaveLength(0);
    expect(ret.props?.reviewsWritten).toHaveLength(0);
    expect(ret.props?.profileTab).toBe('');
    expect(ret.props?.reviewsReceivedCount).toBe(1);
    expect(ret.props?.reviewsWrittenCount).toBe(1);
    expect(ret.props?.user._id).toBe(TestId.USER);
    expect(ret.props?.followerCountInit).toBe(0);
    expect(ret.props?.reqUserFollowing).toHaveLength(2);
  });
  test('getServerSideProps page 2', async () => {
    const context = {
      params: {
        name: 'test',
      },
      query: {
        page: '2',
      },
    };

    const ret = await getServerSideProps(context as unknown as GetServerSidePropsContext);

    expect(ret.props).toBeDefined();
    expect(ret.props?.pageProp).toBe(2);
  });
  test('getReviewsByUserId with invalid userId', async () => {
    jest.spyOn(logger, 'error').mockImplementation(() => ({} as Logger));

    const reviews = await getReviewsByUserId('invalid');

    expect(reviews).toBeNull();
  });
  test('getReviewsByUserIdCount with invalid userId', async () => {
    jest.spyOn(logger, 'error').mockImplementation(() => ({} as Logger));

    const reviews = await getReviewsByUserIdCount('invalid');

    expect(reviews).toBeNull();
  });
  test('getReviewsForUserId with invalid userId', async () => {
    jest.spyOn(logger, 'error').mockImplementation(() => ({} as Logger));

    const reviews = await getReviewsForUserId('invalid');

    expect(reviews).toBeNull();
  });
  test('getReviewsForUserIdCount with invalid userId', async () => {
    jest.spyOn(logger, 'error').mockImplementation(() => ({} as Logger));

    const reviews = await getReviewsForUserIdCount('invalid');

    expect(reviews).toBeNull();
  });
  test('getServerSideProps with a db error should fail', async () => {
    jest.spyOn(search, 'doQuery').mockReturnValueOnce(Promise.resolve(null));

    const context = {
      params: {
        name: 'test',
        tab: [ProfileTab.Levels],
      },
      query: {
        page: '2',
      },
    };

    await expect(getServerSideProps(context as unknown as GetServerSidePropsContext)).rejects.toThrow('Error finding Levels');
  });
});
