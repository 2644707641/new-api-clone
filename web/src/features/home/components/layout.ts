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
export const homeHeroLayoutClasses = {
  section:
    'min-h-home-hero relative z-10 overflow-hidden px-5 pt-24 pb-16 sm:px-6 md:pt-28 md:pb-20 lg:flex lg:items-center lg:pt-24 lg:pb-16',
  columns:
    'relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-16',
  intro: 'flex min-w-0 flex-col items-start text-left',
  panel: 'flex min-w-0 w-full justify-center lg:justify-end',
} as const
