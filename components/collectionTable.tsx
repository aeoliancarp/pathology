import React, { useContext, useState } from 'react';
import AddCollectionModal from './modal/addCollectionModal';
import Collection from '../models/db/collection';
import DeleteCollectionModal from './modal/deleteCollectionModal';
import Dimensions from '../constants/dimensions';
import Link from 'next/link';
import { PageContext } from '../contexts/pageContext';

interface CollectionTableProps {
  collections: Collection[] | undefined;
  getCollections: () => void;
}

export default function CollectionTable({ collections, getCollections }: CollectionTableProps) {
  const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);
  const [isDeleteCollectionOpen, setIsDeleteCollectionOpen] = useState(false);
  const { windowSize } = useContext(PageContext);
  const [collectionToModify, setCollectionToModify] = useState<Collection>();
  const tableWidth = windowSize.width - 2 * Dimensions.TableMargin;

  if (!collections) {
    return (
      <div
        style={{
          margin: Dimensions.TableMargin,
          textAlign: 'center',
        }}
      >
        Loading collections...
      </div>
    );
  }

  const rows = [
    <tr key={-1} style={{ backgroundColor: 'var(--bg-color-2)' }}>
      <th colSpan={3} style={{ height: Dimensions.TableRowHeight }}>
        <button
          className='font-bold underline'
          onClick={() => {
            setCollectionToModify(undefined);
            setIsAddCollectionOpen(true);
          }}
        >
          + New Collection...
        </button>
      </th>
    </tr>
  ];

  for (let i = 0; i < collections.length; i++) {
    rows.push(
      <tr key={i}>
        <td className='break-all' style={{ height: Dimensions.TableRowHeight }}>
          <Link href={`/edit/collection/${collections[i]._id}`} passHref>
            <a className='font-bold underline'>{collections[i].name}</a>
          </Link>
        </td>
        <td style={{ width: Dimensions.ControlWidth / 2 }}>
          <button
            className='italic underline'
            onClick={() => {
              setCollectionToModify(collections[i]);
              setIsAddCollectionOpen(true);
            }}
          >
            Edit
          </button>
        </td>
        <td style={{ width: Dimensions.ControlWidth * 3 / 4 }}>
          <button
            className='italic underline'
            onClick={() => {
              setCollectionToModify(collections[i]);
              setIsDeleteCollectionOpen(true);
            }}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  }

  if (rows.length === 1) {
    rows.push(
      <tr key={-1}>
        <td className='italic' colSpan={4} style={{ height: Dimensions.TableRowHeight }}>
          No collections
        </td>
      </tr>
    );
  }

  return (
    <div>
      <table style={{
        margin: `${Dimensions.TableMargin}px auto`,
        minWidth: 300,
        width: tableWidth,
      }}>
        <tbody>
          {rows}
        </tbody>
      </table>
      <AddCollectionModal
        closeModal={() => {
          setIsAddCollectionOpen(false);
          getCollections();
        }}
        collection={collectionToModify}
        isOpen={isAddCollectionOpen}
      />
      {collectionToModify ? <DeleteCollectionModal
        closeModal={() => {
          setIsDeleteCollectionOpen(false);
          getCollections();
        }}
        collection={collectionToModify}
        isOpen={isDeleteCollectionOpen}
      /> : null}
    </div>
  );
}