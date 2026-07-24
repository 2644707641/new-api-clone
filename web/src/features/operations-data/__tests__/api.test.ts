/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import assert from 'node:assert/strict'
import { test } from 'node:test'

import { buildOperationsReportQuery } from '../api'

test('serializes the selected report date range as Unix timestamps', () => {
  assert.equal(
    buildOperationsReportQuery({
      startTimestamp: 1_704_067_200,
      endTimestamp: 1_704_153_599,
    }),
    'start_timestamp=1704067200&end_timestamp=1704153599'
  )
})
