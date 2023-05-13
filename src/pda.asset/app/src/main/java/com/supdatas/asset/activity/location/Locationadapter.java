package com.supdatas.asset.activity.location;

import android.content.Context;
import android.graphics.Color;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.supdatas.asset.DateUtils;
import com.supdatas.asset.R;
import com.supdatas.asset.business.base.Asset;
import com.supdatas.asset.frame.utility.TextUtil;
import com.supdatas.asset.model.asset.AssetEntity;
import com.supdatas.asset.model.inventory.InventoryDtlEntity;

import java.util.ArrayList;
import java.util.List;

public class Locationadapter extends RecyclerView.Adapter<Locationadapter.VH> {

	private List<AssetEntity> dataList;
	private Context mContext;
	private int mPosition;
	private int mDataSrc;

	public Locationadapter(Context context, List<AssetEntity> datas, int dataSrc) {

		if (datas == null) {
			datas = new ArrayList<>();
		}
		this.dataList = datas;
		this.mContext = context;
		mDataSrc = dataSrc;
	}

	@Override
	public VH onCreateViewHolder(ViewGroup parent, int viewType) {
		//return new VH(View.inflate(mContext, R.layout.item_location_dtl, null));
		View inflate = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_location_dtl, parent, false);
		return new VH(inflate);
	}

	@Override
	public void onBindViewHolder(final VH holder, final int positionUseLess) {

		final int position = holder.getAdapterPosition();

		AssetEntity obj = dataList.get(position);
		holder.mTvAssetId.setText(obj.assetId);
		holder.mTvAssetName.setText(obj.assetName);
		holder.mTvAmount.setText(obj.amount);
		holder.mTvBuyDate.setText(DateUtils.getDateTimeByDelZone(obj.purchaseDate));
		holder.mTvStatus.setText(Asset.getAssetStatus(obj.status) + " / " + Asset.getUseStatus(obj.useStatus));
		holder.mTvAssetBrand.setText(obj.brand);
		holder.mTvEpc.setText(obj.epc);

		if (mDataSrc >= 1) {
			if (dataList.get(position).hasFound) {
				holder.mTvFoundStatus.setText("已找到");
				holder.mTvFoundStatus.setTextColor(mContext.getResources().getColor(R.color.red));
			} else {
				holder.mTvFoundStatus.setText("未找到");
				holder.mTvFoundStatus.setTextColor(mContext.getResources().getColor(R.color.black));
			}
		}
		else{
			holder.mTvFoundStatus.setVisibility(View.GONE);
		}
		holder.mTvSignal.setText(dataList.get(position).rssi);
		holder.mTvCnt.setText(String.valueOf(dataList.get(position).cnt));

		holder.itemView.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {

				if (rowClickedListener != null) {
					rowClickedListener.onClick(position);
					notifyDataSetChanged();
				}
			}
		});

		if((position + 1) % 2 == 0){
			holder.itemView.setBackgroundColor(mContext.getResources().getColor(R.color.light_grey5));
		} else {
			holder.itemView.setBackgroundColor(Color.WHITE);
		}
		if (position == getPosition()) {
			holder.itemView.setBackgroundColor(mContext.getResources().getColor(R.color.light_blue2));
		}
	}

	@Override
	public int getItemCount() {
		return dataList.size();
	}

	/**删除监听器*/
	private ExpendDtlListener mExtDtlListener;

	/**
	 * 设置监听器
	 *
	 * @param listener 监听器
	 */
	public void setOnDelBillListener(ExpendDtlListener listener) {

		this.mExtDtlListener = listener;
	}

	public interface ExpendDtlListener{

		/***
		 * @param product 商品
		 */
		public void onExpend(InventoryDtlEntity product);
	}

	public class VH extends RecyclerView.ViewHolder {

		TextView mTvAssetId;
		TextView mTvAmount;
		TextView mTvAssetName;
		TextView mTvUsePerson;
		TextView mTvBuyDate;
		TextView mTvAssetBrand;
		TextView mTvStatus;
		TextView mTvEpc;
		TextView mTvSignal;
		TextView mTvCnt;
		TextView mTvFoundStatus;

		public VH(View itemView) {
			super(itemView);

			mTvAssetId = (TextView) itemView.findViewById(R.id.tv_asset_id);
			mTvAmount = (TextView) itemView.findViewById(R.id.tv_amount);
			mTvAssetName = (TextView) itemView.findViewById(R.id.tv_asset_name);
			mTvUsePerson = (TextView) itemView.findViewById(R.id.tv_use_pesson);
			mTvBuyDate = (TextView) itemView.findViewById(R.id.tv_buy_date);
			mTvAssetBrand = (TextView) itemView.findViewById(R.id.tv_asset_brand);
			mTvEpc = (TextView) itemView.findViewById(R.id.tv_epc);
			mTvStatus = (TextView) itemView.findViewById(R.id.tv_status);
			mTvSignal = (TextView) itemView.findViewById(R.id.tv_signal);
			mTvCnt = (TextView) itemView.findViewById(R.id.tv_cnt);
			mTvFoundStatus = (TextView) itemView.findViewById(R.id.tv_found_status);
		}
	}

	public interface RowClickedListener {

		void onClick(int position);
	}

	private RowClickedListener rowClickedListener;

	public void setGetListener(RowClickedListener getListener) {
		this.rowClickedListener = getListener;
	}

	public int getPosition() {
		return mPosition;
	}

	public void setPosition(int mPosition) {
		this.mPosition = mPosition;
	}
}
