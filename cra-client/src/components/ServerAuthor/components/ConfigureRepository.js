/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

import React, { useContext } from "react";
import {
  Button,
  SelectableTile,
} from "carbon-components-react";

import { ServerAuthorContext } from "../contexts/ServerAuthorContext";

export default function ConfigureRepository() {

  const {
      newServerRepository, setNewServerRepository,
  } = useContext(ServerAuthorContext);

  

  return (

    <div style={{ textAlign: 'left' }}>
        <fieldset className="bx--fieldset" style={{ marginBottom: "32px" }}>
          <legend className="bx--label" style={{ textAlign: "left" }}>Server repository type</legend>
          <TileGroup
            defaultSelected="in-memory-repository"
            name="repository-types"
            valueSelected={newServerRepository}
            legend=""
            onChange={value => setNewServerRepository(value)}
            style={{marginTop: "16px", textAlign: "left"}}
          >
            <RadioTile
              id="in-memory-repository"
              light={false}
              name="in-memory-repository"
              tabIndex={0}
              value="in-memory-repository"
            >
              In Memory
            </RadioTile>
            <RadioTile
              id="local-graph-repository"
              light={false}
              name="local-graph-repository"
              tabIndex={1}
              value="local-graph-repository"
            >
              Janus Graph
            </RadioTile>
            <RadioTile
              id="read-only-repository"
              light={false}
              name="read-only-repository"
              tabIndex={2}
              value="read-only-repository"
            >
              Read Only
            </RadioTile>
          </TileGroup>
        </fieldset>
    </div>

  )

}