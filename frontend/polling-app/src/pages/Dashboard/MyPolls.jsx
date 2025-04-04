import React, { useContext, useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useUserAuth from '../../hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import PollCard from '../../components/PollCards/PollCard';
import HeaderWithFilter from '../../components/layout/HeaderWithFilter';

import InfiniteScroll from "react-infinite-scroll-component"
import { UserContext } from '../../context/UserContext';
import EmptyCard from '../../components/cards/EmptyCard';

import CREATE_ICON from "../../assets/images/my-poll-icon.png"

const PAGE_SIZE = 10;

const MyPolls = () => {
  useUserAuth();

  const navigate = useNavigate();

  const {user} = useContext(UserContext)

  const [allPolls, setAllPolls] = useState([]);
  const [stats, setStats] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('');

  const fetchAllPolls = async (overridePage = page) => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.POLLS.GET_ALL}?page=${overridePage}&limit=${PAGE_SIZE}&type=${filterType}&creatorId=${user._id}`
      );

      if (response.data?.polls?.length > 0) {
        setAllPolls((prevPolls) =>
          overridePage === 1 ? response.data.polls : [...prevPolls, ...response.data.polls]
        );
        setStats(response.data?.stats || []);
        setHasMore(response.data.polls.length === PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching polls:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePolls = () => {
    setPage((prevPage) => prevPage + 1);
  }

  useEffect(() => {
    setPage(1);
    fetchAllPolls(1);
  }, [filterType]);

  useEffect(() => {
    if (page !== 1) {
      fetchAllPolls();
    }
  }, [page]);

  return (
    <DashboardLayout activeMenu="My Polls">
      <div className="my-5 mx-auto">
        <HeaderWithFilter title="My Polls" filterType={filterType} setFilterType={setFilterType} />

      {allPolls.length === 0 && !loading && (
        <EmptyCard
          imgSrc={CREATE_ICON}
          message="Welcome! You're the first user of the system, and there are no polls yet. Start by creating the first poll."
          btnText="Create Poll"
          onClick={() => navigate("/create-poll")}
        />
      )}

      <InfiniteScroll
        dataLength={allPolls.length}
        next={loadMorePolls}
        hasMore={hasMore}
        loader={<h4 className='info-text'>Loading...</h4>}
        // endMessage={<p className='info-text'>No more polls to display.</p>}
      >


        {allPolls.map((poll) => {
          const creator = poll?.creator || {}; 
          return (
            <PollCard
              key={poll._id}
              pollId={poll._id}
              question={poll.question}
              type={poll.type}
              options={poll.options}
              voters={poll.voters?.length || 0}
              responses={poll.responses || []}
              creatorProfileImg={creator?.profileImageUrl || null} 
              creatorName={creator?.fullName || 'Unknown'}
              creatorUsername={creator?.username || 'anonymous'}
              userHasVoted={poll.userHasVoted || false}
              isPollClosed={poll.isPollClosed || false}
              createdAt={poll.createdAt || ''}
            />
          );
        })}
        </InfiniteScroll>
      </div>
    </DashboardLayout>
  );
};

export default MyPolls;
