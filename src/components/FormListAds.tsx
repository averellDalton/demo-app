import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import {
  Control,
  FieldErrors,
  UseFormRegister,
  useFieldArray,
} from 'react-hook-form';
import { FormValues } from '@/App';
import RHFInput from '@/RHF/RHFInput';
import { get } from 'lodash';
import { cn } from '@/utils/cn';
import { useCallback, useState } from 'react';

type FormListAdsProps = {
  index: number;
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
  register: UseFormRegister<FormValues>;
};

export default function FormListAds({
  errors,
  control,
  register,
  index,
}: FormListAdsProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const { fields, append, remove } = useFieldArray({
    control,
    name: `campaign.subCampaigns.${index}.ads`,
  });

  const handleSelectAllClick = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        const newSelected = fields.map((n) => n.id);
        setSelected(newSelected);
        return;
      }
      setSelected([]);
    },
    [fields],
  );

  const handleClick = useCallback(
    (_: React.MouseEvent<unknown>, id: string) => {
      setSelected((state) => {
        const selectedIndex = state.indexOf(id);
        if (selectedIndex === -1) {
          return state.concat(id);
        } else if (selectedIndex === 0) {
          return state.slice(1);
        } else if (selectedIndex === state.length - 1) {
          return state.slice(0, -1);
        } else if (selectedIndex > 0) {
          const newSelected: string[] = [];
          return newSelected.concat(
            state.slice(0, selectedIndex),
            state.slice(selectedIndex + 1),
          );
        }
        return state;
      });
    },
    [],
  );

  const handleDeleteSelected = useCallback(() => {
    if (selected.length === fields.length) {
      remove();
    } else {
      const indexs = selected
        .map((value) => fields.findIndex((item) => item.id === value))
        .filter((index) => index > -1);
      remove(indexs);
    }
    setSelected([]);
  }, [selected, fields, remove]);

  const isSelected = (id: string) => selected.indexOf(id) > -1;

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex w-full flex-1 flex-col">
        <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
          <caption className="my-2 border-b border-gray-300 p-5 text-left text-lg font-semibold text-gray-900 rtl:text-right dark:bg-gray-800 dark:text-white">
            DANH SÁCH QUẢNG CÁO
          </caption>
          <thead>
            <tr>
              <th className="w-10 p-2 text-center align-middle">
                <input
                  name="selected"
                  type="checkbox"
                  checked={!!selected.length}
                  onChange={handleSelectAllClick}
                  className={cn(
                    'h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-600',
                    {
                      'accent-gray-400':
                        !!selected.length && selected.length !== fields.length,
                    },
                  )}
                />
              </th>
              <th className="p-2">
                {selected.length ? (
                  <button type="button" onClick={handleDeleteSelected}>
                    <TrashIcon className="h-5 w-5" />
                  </button>
                ) : (
                  <span className="text-gray-800">Tên quảng cáo *</span>
                )}
              </th>
              <th className="p-2">
                {!selected.length ? (
                  <span className="text-gray-800">Số lượng *</span>
                ) : null}
              </th>
              <th className="w-10 p-2">
                <div className="flex flex-1 items-center justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      append({
                        quantity: 0,
                        name: `Quảng cáo ${fields.length + 1}`,
                      })
                    }
                    className="flex items-center justify-center gap-x-2 rounded-md border border-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-indigo-500 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Thêm
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, i) => (
              <tr key={field.id}>
                <td className="text-center">
                  <input
                    name="selected"
                    type="checkbox"
                    checked={isSelected(field.id)}
                    onClick={(e) => handleClick(e, field.id)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </td>
                <td className="p-2">
                  <RHFInput
                    label=""
                    {...register(
                      `campaign.subCampaigns.${index}.ads.${i}.name`,
                    )}
                    className={cn({
                      'border-red-500 data-[focus]:outline-red-500/40': get(
                        errors,
                        [
                          'campaign',
                          'subCampaigns',
                          index,
                          'ads',
                          i,
                          'name',
                          'message',
                        ],
                        '',
                      ),
                    })}
                  />
                </td>
                <td className="p-2">
                  <RHFInput
                    label=""
                    defaultValue={0}
                    type="number"
                    {...register(
                      `campaign.subCampaigns.${index}.ads.${i}.quantity`,
                    )}
                    className={cn({
                      'border-red-500 data-[focus]:outline-red-500/40': get(
                        errors,
                        [
                          'campaign',
                          'subCampaigns',
                          index,
                          'ads',
                          i,
                          'quantity',
                          'message',
                        ],
                        '',
                      ),
                    })}
                  />
                </td>
                <td className="p-2 text-right align-middle">
                  <button type="button" onClick={() => remove(i)}>
                    <TrashIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
