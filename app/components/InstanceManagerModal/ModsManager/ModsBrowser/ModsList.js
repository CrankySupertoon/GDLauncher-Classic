import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Link from 'react-router-dom/Link';
import axios from 'axios';
import ContentLoader from 'react-content-loader';
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import _ from 'lodash';
import ModsListWrapper from './ModsListWrapper';
import { PACKS_PATH, CURSEMETA_API_URL } from '../../../../constants';
import { downloadFile } from '../../../../utils/downloader';
import { numberToRoundedWord } from '../../../../utils/numbers';
import { downloadMod } from '../../../../utils/mods';
import ModsListHeader from './ModsListHeader';
import ModPage from './ModPage';

import styles from './ModsList.scss';

const ModsList = props => {
  const [mods, setMods] = useState([]);
  const [areModsLoading, setAreModsLoading] = useState(true);
  const [filterType, setFilterType] = useState('Featured');
  const [modOverview, setModOverview] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => loadMoreMods(null, null, '', true), [filterType]);

  // The "e" param is just used for invoking this function without params in events handlers
  const loadMoreMods = async (e, v, searchQueryP, reset) => {
    console.log("STARTING");
    searchQueryP = searchQueryP !== undefined ? searchQueryP : searchQuery;
    reset = reset !== undefined ? reset : false;
    if (reset === true) {
      setMods([]);
    }
    setAreModsLoading(true);
    const { data } = await axios.get(
      `${CURSEMETA_API_URL}/direct/addon/search?gameId=432&pageSize=21&index=${
        reset === true ? 0 : mods.length
      }&sort=${filterType}&searchFilter=${encodeURI(
        searchQueryP
        )}&gameVersion=${
          props.match.params.version
        }&categoryId=0&sectionId=6&sortDescending=${filterType !== 'Author' &&
        filterType !== 'Name'}`
        );
        setMods(reset === true ? data : mods.concat(data));
        setHasNextPage(data.length === 21);
        setAreModsLoading(false);
        console.log("ENDING");
      };
      
      if (mods.length === 0) {
        return (
          <div style={{ width: '100%', height: '100%' }}>
        <ModsListHeader
          loadMoreMods={loadMoreMods}
          filter={filterType}
          setFilter={setFilterType}
          setSearchQuery={setSearchQuery}
        />
        <AutoSizer>
          {({ height, width }) => (
            <ContentLoader
              height={height}
              width={width}
              speed={0.6}
              ariaLabel={false}
              primaryColor="var(--secondary-color-2)"
              secondaryColor="var(--secondary-color-3)"
              style={{
                width,
                height
              }}
            >
              {[...Array(Math.round(height / 100))].map((v, i) =>
                [...Array(Math.round(3))].map((v1, k) => (
                  <rect
                    x={(width / 3) * (k !== 2 ? k : k * 0.97) + (k === 0 ? 38 : 28)}
                    y={i * 180 + 18}
                    rx="0"
                    ry="0"
                    width={150}
                    height={144}
                  />
                ))
              )}
            </ContentLoader>
          )}
        </AutoSizer>
      </div>
    );
  }

  return (
    <div className={styles.modsContainer}>
      <ModsListHeader
        loadMoreMods={loadMoreMods}
        filter={filterType}
        setFilter={setFilterType}
        setSearchQuery={setSearchQuery}
      />
      <AutoSizer>
        {({ height, width }) => (
          <ModsListWrapper
            hasNextPage={hasNextPage}
            isNextPageLoading={areModsLoading}
            items={mods}
            loadNextPage={loadMoreMods}
            width={width}
            height={height}
            setClick={setModOverview}
          />
        )}
      </AutoSizer>
      {modOverview !== null && (
        <ModPage
          mod={modOverview}
          version={props.match.params.version}
          instance={props.match.params.instance}
          goBack={() => setModOverview(null)}
        />
      )}
    </div>
  );
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(ModsList);