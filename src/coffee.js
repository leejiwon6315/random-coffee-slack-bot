import fs from 'fs';
import { pool } from './constants.js';
import dayjs from 'dayjs';
import { REJECT_MESSAGE, SUDO_OPEN, COFFEE_MESSAGE } from './message.js';

const chunk = (data = [], size = 1) => {
  const arr = [];

  for (let i = 0; i < data.length; i += size) {
    arr.push(data.slice(i, i + size));
  }

  return arr;
};

const createRandomCoffee = (list = []) => {
  const ment = Math.floor(Math.random() * 4) || 0;
  let result = `${COFFEE_MESSAGE[ment]} \n`;

  if (!list.length) {
    return '그룹을 생성해주세요.';
  }

  list.forEach(
    (team, idx) => (result = result + `${idx + 1}그룹: ${team.join(', ')} \n`),
  );

  return result;
};

const createRandomMembers = () => {
  const chunkedList = chunk(
    pool.sort(() => 0.5 - Math.random()),
    5,
  );
  const chunkedListLength = chunkedList.length;
  const lastIndex = chunkedListLength - 1;
  const lastTeam = chunkedList[lastIndex];
  const lastTeamLength = lastTeam.length;

  if (lastTeamLength <= chunkedListLength) {
    switch (lastTeamLength) {
      case 3:
        const caseThreeResult = chunkedList.slice(0, lastIndex - 1);
        const separatedTeam = chunkedList[lastIndex - 1];
        const newSeparatedTeam = separatedTeam.slice(
          0,
          separatedTeam.length - 1,
        );
        const newLastTeam = [
          ...lastTeam,
          separatedTeam[separatedTeam.length - 1],
        ];

        return [...caseThreeResult, newSeparatedTeam, newLastTeam];
      case 2:
      case 1:
        const caseOneResult = chunkedList.slice(0, lastIndex);
        lastTeam.forEach((member, idx) => caseOneResult[idx].push(member));

        return caseOneResult;
      default:
        return chunkedList;
    }
  }

  return chunkedList;
};

const shuffleMembers = (multiDimensionalList) => {
  const newMemberList = [...multiDimensionalList];
  const groupLength = multiDimensionalList.length;
  const shuffledList = [];
  let tmpGroup = [];
  let count = 0;

  // 각 그룹내에서 순서 셔플
  for (let i = 0; i < groupLength; i++) {
    newMemberList[i].sort(() => 0.5 - Math.random());
  }

  // 각 그룹의 인덱스를 기준으로 5명씩 뽑아 새로운 그룹으로 조합
  for (let i = 0; i <= 5; i++) {
    for (let j = 0; j < groupLength; j++) {
      if (count !== 0 && count % 5 === 0) {
        shuffledList.push(tmpGroup);

        tmpGroup = [];
        count = 0;
      }

      if (newMemberList[j][i]) {
        tmpGroup.push(newMemberList[j][i]);
        count++;
      }
    }
  }

  // 3명 미만인 그룹이 존재한다면 4명인 그룹의 마지막에서부터 재배치
  if (tmpGroup.length < 3) {
    tmpGroup.forEach((member, index) => {
      shuffledList[shuffledList.length - (index + 1)].push(member);
    });
  }

  // 3명인 그룹이 존재한다면 직전 그룹의 마지막 인원을 3명 그룹으로 재할당
  else if (tmpGroup.length === 3) {
    const shuffledListLastTeam = shuffledList[shuffledList.length - 1];
    const newShuffledListLastTeam = shuffledListLastTeam.slice(
      0,
      shuffledListLastTeam.length - 1,
    );
    const shuffledListLastMember =
      shuffledListLastTeam[shuffledListLastTeam.length - 1];

    shuffledList.splice(shuffledList.length - 1, 1, newShuffledListLastTeam);
    shuffledList.push([...tmpGroup, shuffledListLastMember]);
  }

  // 4명인 그룹이 존재한다면 그대로 유지
  else if (tmpGroup.length === 4) {
    shuffledList.push(tmpGroup);
  }

  // 그룹의 멤버 수를 기준으로 정렬
  return tmpGroup.length
    ? shuffledList.sort((a, b) => b.length - a.length)
    : shuffledList;
};

const fireByFile = (fire, textFile) => {
  fs.promises
    .readFile(textFile, 'utf8', (error) => {
      if (error) {
        console.log(error, ': Read Error');
      }
    })
    .then((data) => {
      if (data) {
        const newGroups = shuffleMembers(JSON.parse(data));
        fs.writeFile(textFile, JSON.stringify(newGroups), (error) => {
          if (error) {
            console.log(error, ': Update Value Write Error');

            return 'Error';
          }
        });

        console.log('updated new Random coffee groups');

        fire(createRandomCoffee(newGroups));
        return;
      } else {
        const initialValue = createRandomMembers();
        fs.writeFile(textFile, JSON.stringify(initialValue), (error) => {
          if (error) {
            console.log(error, ': Initial Value Write Error');

            return 'Error';
          }
        });

        console.log('created new Random coffee groups');

        fire(createRandomCoffee(initialValue));
        return;
      }
    });
};

export const executeBoltCoffeeBot = async (text, fire, count) => {
  const TXT_FILE = './coffee-chat.txt';
  const today = new dayjs();
  const startDate = new dayjs('2023-07-31');
  const diff = today.diff(startDate, 'day') % 7;

  if (text !== SUDO_OPEN && diff !== 0) {
    if (!count) {
      await fire(`다음 커피챗까지 ${7 - diff}일이 남았어요!`);

      return;
    }

    const randomNumber = Math.floor(Math.random() * 8);

    await fire(REJECT_MESSAGE[randomNumber]);

    return;
  }

  fireByFile(fire, TXT_FILE);
  return;
};

export const executeSchedulerCoffeeBot = async (fire) => {
  const TXT_FILE = './coffee-chat.txt';

  fireByFile(fire, TXT_FILE);
  return;
};
