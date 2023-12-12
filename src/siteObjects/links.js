import { writeFile } from 'fs/promises';
import axios from 'axios';
import log from '../utils/debugEl.js';

const linksLog = log.extend('links');

const downloadLinks = ($, stringMaker) => {
  const arrPromises = [];
  const listLinks = $('link');

  listLinks.each((i, { attribs }) => {
    /**
   * Проверяет ссылку на ассет и в случае необходимости подставляет недостающие элементы ссылки
   * @returns url для скачивания ассета
   */
    const getHrefCurrentElement = () => {
      if (attribs.href.search(/\/(?<=^.)/g) === -1) return attribs.href;
      return stringMaker.makeStrSiteWithoutDirs(attribs.href);
    };
    const hrefCurrentElement = getHrefCurrentElement();
    const makingFile = (dataHref) => {
      let pathToFile;
      if (attribs.rel === 'canonical' || (attribs.rel === 'alternate' && attribs.type !== 'application/rss+xml')) pathToFile = stringMaker.makePathElementFile(hrefCurrentElement).concat('.html');
      else pathToFile = stringMaker.makePathElementFile(hrefCurrentElement);
      return writeFile(pathToFile, dataHref);
    };
    const downloadLink = axios.get(hrefCurrentElement, { responseType: 'document' })
      .then((response) => {
        linksLog('GET link: ', hrefCurrentElement);
        makingFile(response.data);
      })
      // eslint-disable-next-line no-param-reassign
      .catch((e) => {
        linksLog('Error:link', e.message);
        console.log('\x1b[1m', '\x1b[31m', `${e.name}: ${e.message} in asset 'link':\n${hrefCurrentElement}`, '\x1b[0m');
      });

    arrPromises.push(downloadLink);
    // eslint-disable-next-line no-param-reassign
    if (attribs.rel === 'canonical') attribs.href = stringMaker.makeURLFileAsset(hrefCurrentElement).concat('.html');
    // eslint-disable-next-line no-param-reassign
    else attribs.href = stringMaker.makeURLFileAsset(hrefCurrentElement);
  });

  return Promise.all(arrPromises).then(() => $, stringMaker);
};

export default downloadLinks;
