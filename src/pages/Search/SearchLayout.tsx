import React from "react";
import styled from "styled-components";
import Spinner from "../../components/ui/Spinner";

export const SearchContainer = styled.div`
  max-width: 800px;
  padding: 5px 10px;
  margin: 0 auto;
`;

export const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

export const ResultText = styled.span`
  font-size: 20px;
  font-weight: 600;
  margin-right: 10px;
  color: red;
`;

export const ResultList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const NoResults = styled.div`
  font-size: 18px;
  color: #555;
`;

interface SearchLayoutProps {
  isLoading: boolean;
  titleContent: React.ReactNode;
  hasResults: boolean;
  children: React.ReactNode;
}

const SearchLayout = ({
  isLoading,
  titleContent,
  hasResults,
  children,
}: SearchLayoutProps) => {
  return (
    <SearchContainer>
      {isLoading ? (
        <Spinner />
      ) : (
        <div>
          <Title>{titleContent}</Title>
          {hasResults ? (
            <ResultList>{children}</ResultList>
          ) : (
            <NoResults>검색 결과가 없습니다.</NoResults>
          )}
        </div>
      )}
    </SearchContainer>
  );
};

export default SearchLayout;
