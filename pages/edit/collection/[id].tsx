import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../contexts/appContext';
import Collection from '../../../models/db/collection';
import Dimensions from '../../../constants/dimensions';
import LinkInfo from '../../../models/linkInfo';
import Page from '../../../components/page';
import Select from '../../../components/select';
import SelectOption from '../../../models/selectOption';
import StatsHelper from '../../../helpers/statsHelper';
import formatAuthorNote from '../../../helpers/formatAuthorNote';
import { useRouter } from 'next/router';
import useStats from '../../../hooks/useStats';
import useUser from '../../../hooks/useUser';

export default function CollectionEditPage() {
  const router = useRouter();
  const { isLoading, user } = useUser();
  const { id } = router.query;
  const { stats } = useStats();
  const { setIsLoading } = useContext(AppContext);
  const [collection, setCollection] = useState<Collection>();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/');
    }
  }, [isLoading, router, user]);

  const getCollection = useCallback(() => {
    if (!id) {
      return;
    }

    fetch(`/api/collection/${id}`, {
      method: 'GET',
    }).then(async res => {
      if (res.status === 200) {
        setCollection(await res.json());
      } else {
        throw res.text();
      }
    }).catch(err => {
      console.error(err);
      alert('Error fetching collection');
    });
  }, [id]);

  useEffect(() => {
    getCollection();
  }, [getCollection]);

  useEffect(() => {
    setIsLoading(!collection);
  }, [setIsLoading, collection]);

  const getOptions = useCallback(() => {
    if (!collection || !collection.levels) {
      return [];
    }

    const levels = collection.levels;
    const levelStats = StatsHelper.levelStats(levels, stats);

    return levels.map((level, index) => new SelectOption(
      level._id.toString(),
      level.name,
      level.isDraft ? `/edit/${level._id.toString()}` : `/level/${level._id.toString()}`,
      levelStats[index],
      Dimensions.OptionHeightMedium,
      undefined,
      level.points,
      level,
      false, // disabled
      true, // draggable
    ));
  }, [stats, collection]);

  const onChange = function(updatedItems: SelectOption[]) {
    if (!collection) {
      return;
    }

    fetch(`/api/collection/${collection._id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        levels: updatedItems.map(option => option.id),
      }),
    }).then(async res => {
      if (res.status === 200) {
        setCollection(await res.json());
      } else {
        throw res.text();
      }
    }).catch(err => {
      console.error(err);
      alert('Error updating collection');
    });
  };

  return (
    <Page
      folders={[
        new LinkInfo('Create', '/create'),
      ]}
      title={collection?.name ?? 'Loading...'}
    >
      <>
        {!collection || !collection.authorNote ? null :
          <div
            style={{
              margin: Dimensions.TableMargin,
              textAlign: 'center',
            }}
          >
            {formatAuthorNote(collection.authorNote)}
          </div>
        }
        <Select onChange={onChange} options={getOptions()} prefetch={false}/>
      </>
    </Page>
  );
}