import React from 'react';

import styles from './section.module.css';

const Section = ({ children }) => {
  return(
    <div className={styles.container}>
      <section>
        <h2>TECHNOLOGY</h2>
        <p>
          All peer-to-peer networks built using Shardus will benefit from sharding and auto-scaling to provide high throughput, low latency, and immediate finality while maintaining the highest level of decentralization and security.
        </p>
        <p>
          The supporting technology that allows for these features is our unique Shardus Consensus Algorithm, which is based on Proof-of-Quorum, in combination with the Shardus Distributed Ledger, which addresses the problems of linear scaling and state sharding as the network grows.
        </p>
      </section>
      
    </div>
  );
};


export default Section;