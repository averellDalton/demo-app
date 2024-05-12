import { FormValues } from '@/App';
import RHFCheckbox from '@/RHF/RHFCheckbox';
import RHFInput from '@/RHF/RHFInput';
import { cn } from '@/utils/cn';
import { get } from 'lodash';
import { useState } from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { CheckCircleIcon, PlusIcon } from '@heroicons/react/24/solid';
import FormListAds from './FormListAds';

type FormChienDichConProps = {
  myForm: UseFormReturn<FormValues>;
};

export default function FormChienDichCon({ myForm }: FormChienDichConProps) {
  const {
    watch,
    control,
    register,
    formState: { errors },
  } = myForm;
  const [currentIndex, setCurrentIndex] = useState(0);
  const { fields, append } = useFieldArray({
    control,
    name: `campaign.subCampaigns`,
  });
  const items = watch(`campaign.subCampaigns`);

  return (
    <>
      <div className="flex flex-1 flex-col gap-x-4">
        <div className="flex flex-1 gap-x-4">
          <div>
            <button
              type="button"
              onClick={() => {
                append({
                  name: `Chiến dịch con ${items.length}`,
                  status: true,
                  ads: [{ name: 'Quảng cáo 1', quantity: 0 }],
                });
              }}
              className="rounded-lg bg-white p-2"
            >
              <PlusIcon className="h-5 w-5 text-red-500" />
            </button>
          </div>

          <div className="flex flex-1 gap-x-4">
            {items.map((subCampaign, index) => {
              const total = subCampaign.ads.reduce(
                (sum: number, item) => sum + Number(item.quantity),
                0,
              );
              const inValid = get(
                errors,
                ['campaign', 'subCampaigns', index],
                false,
              );
              return (
                <div
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    'flex h-40 w-60 flex-col items-center justify-start gap-y-4 rounded-lg border border-transparent  bg-white p-4',
                    { 'border-blue-500': currentIndex === index },
                  )}
                >
                  <div className="flex items-center justify-center gap-x-2">
                    <span
                      className={cn('text-base', {
                        'text-red-500': inValid,
                      })}
                    >
                      {subCampaign.name}
                    </span>
                    <CheckCircleIcon
                      className={cn('h-4 w-4 text-green-500', {
                        'text-gray-400': !subCampaign.status,
                      })}
                    />
                  </div>
                  <span className="text-lg font-medium">{total}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex w-full flex-1 flex-col">
        {fields.map((ads, index) => {
          if (currentIndex !== index) {
            return null;
          }
          return (
            <div key={ads.id} className="flex flex-1 flex-col gap-y-4">
              <div className="flex flex-1 items-end ">
                <RHFInput
                  label="Tên chiến dịch *"
                  {...register(`campaign.subCampaigns.${index}.name`)}
                  helperText={get(
                    errors,
                    ['campaign', 'subCampaigns', index, 'name', 'message'],
                    '',
                  )}
                />
                <RHFCheckbox
                  type="checkbox"
                  label="Đang hoạt động"
                  {...register(`campaign.subCampaigns.${index}.status`)}
                />
              </div>

              <FormListAds
                index={index}
                errors={errors}
                control={control}
                register={register}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
